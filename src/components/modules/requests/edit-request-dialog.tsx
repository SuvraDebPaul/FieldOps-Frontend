"use client";

import { useForm } from "@tanstack/react-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SelectField from "@/components/form/fields/select-field";
import TextField from "@/components/form/fields/text-field";
import TextareaField from "@/components/form/fields/textarea-field";
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
import { PRIORITY_OPTIONS } from "@/constants/request.constants";
import { useUpdateRequest } from "@/hooks";
import type { ServiceRequestBase } from "@/types";
import { fromDateTimeLocal, toDateTimeLocal } from "@/utils";
import { type DetailsStepValues, detailsStepSchema } from "@/validation";

export default function EditRequestDialog({
  request,
}: {
  request: ServiceRequestBase;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit {request.code}</DialogTitle>
          <DialogDescription>
            You can change the details until a dispatcher reviews the request.
          </DialogDescription>
        </DialogHeader>
        <EditRequestForm request={request} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function EditRequestForm({
  request,
  onDone,
}: {
  request: ServiceRequestBase;
  onDone: () => void;
}) {
  const updateRequest = useUpdateRequest();

  const defaultValues: DetailsStepValues = {
    title: request.title,
    description: request.description,
    priority: request.priority,
    preferredAt: toDateTimeLocal(request.preferredAt),
  };

  const form = useForm({
    defaultValues,
    validators: { onChange: detailsStepSchema },
    onSubmit: ({ value }) => {
      updateRequest.mutate(
        {
          requestId: request.id,
          title: value.title.trim(),
          description: value.description.trim(),
          priority: value.priority,
          preferredAt: fromDateTimeLocal(value.preferredAt),
        },
        {
          onSuccess: () => {
            toast.success("Request updated");
            onDone();
          },
        },
      );
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
        <form.Field name="title">
          {(field) => (
            <TextField field={field} label="Short title" maxLength={150} />
          )}
        </form.Field>
        <form.Field name="description">
          {(field) => (
            <TextareaField
              field={field}
              label="What's happening?"
              rows={5}
              maxLength={2000}
            />
          )}
        </form.Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="priority">
            {(field) => (
              <SelectField
                field={field}
                label="Priority"
                options={PRIORITY_OPTIONS}
              />
            )}
          </form.Field>
          <form.Field name="preferredAt">
            {(field) => (
              <TextField
                field={field}
                label="Preferred time"
                type="datetime-local"
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
          <Button type="submit" disabled={updateRequest.isPending}>
            {updateRequest.isPending && <Spinner />} Save changes
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
