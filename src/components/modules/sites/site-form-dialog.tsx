"use client";

import { useForm } from "@tanstack/react-form";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import TextField from "@/components/form/fields/text-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useCreateSite, useUpdateSite } from "@/hooks";
import type { Site } from "@/types";
import { type SiteFormValues, siteSchema } from "@/validation";

interface SiteFormDialogProps {
  site?: Site;
  trigger: ReactNode;
}

export default function SiteFormDialog({ site, trigger }: SiteFormDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{site ? "Edit site" : "Add a site"}</DialogTitle>
          <DialogDescription>
            {site
              ? "Update the address or the on-site contact."
              : "Where should technicians go? Add as many sites as you need."}
          </DialogDescription>
        </DialogHeader>
        <SiteForm site={site} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function SiteForm({ site, onDone }: { site?: Site; onDone: () => void }) {
  const createSite = useCreateSite();
  const updateSite = useUpdateSite();
  const isPending = createSite.isPending || updateSite.isPending;

  const defaultValues: SiteFormValues = {
    label: site?.label ?? "",
    address: site?.address ?? "",
    city: site?.city ?? "",
    contactName: site?.contactName ?? "",
    contactPhone: site?.contactPhone ?? "",
  };

  const form = useForm({
    defaultValues,
    validators: { onChange: siteSchema },
    onSubmit: ({ value }) => {
      const onSuccess = () => {
        toast.success(site ? "Site updated" : "Site added");
        onDone();
      };

      if (site) {
        updateSite.mutate({ siteId: site.id, ...value }, { onSuccess });
      } else {
        createSite.mutate(value, { onSuccess });
      }
    },
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="label">
          {(field) => (
            <TextField
              field={field}
              label="Site name"
              placeholder="e.g. Gazipur Dyeing Unit"
            />
          )}
        </form.Field>
        <form.Field name="address">
          {(field) => (
            <TextField
              field={field}
              label="Address"
              autoComplete="street-address"
            />
          )}
        </form.Field>
        <form.Field name="city">
          {(field) => (
            <TextField
              field={field}
              label="City"
              autoComplete="address-level2"
            />
          )}
        </form.Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="contactName">
            {(field) => <TextField field={field} label="On-site contact" />}
          </form.Field>
          <form.Field name="contactPhone">
            {(field) => (
              <TextField
                field={field}
                label="Contact phone"
                type="tel"
                autoComplete="tel"
              />
            )}
          </form.Field>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />}
            {site ? "Save changes" : "Add site"}
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
