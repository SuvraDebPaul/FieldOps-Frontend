"use client";

import { useForm } from "@tanstack/react-form";
import { MapPin, Plus } from "lucide-react";
import RadioCardField from "@/components/form/fields/radio-card-field";
import SiteFormDialog from "@/components/modules/sites/site-form-dialog";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSites } from "@/hooks";
import { useRequestWizardStore } from "@/stores";
import { siteStepSchema } from "@/validation";
import WizardActions from "./wizard-actions";
import { WIZARD_SITE_PARAMS } from "./wizard.constants";

export default function StepSite() {
  const siteId = useRequestWizardStore((s) => s.draft.siteId);
  const updateDraft = useRequestWizardStore((s) => s.updateDraft);
  const nextStep = useRequestWizardStore((s) => s.nextStep);
  const { data, isPending } = useSites(WIZARD_SITE_PARAMS);

  const form = useForm({
    defaultValues: { siteId },
    validators: { onChange: siteStepSchema },
    onSubmit: ({ value }) => {
      updateDraft(value);
      nextStep();
    },
  });

  if (isPending) return <Skeleton className="h-40 w-full rounded-xl" />;

  const sites = data?.data ?? [];

  if (sites.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="Add a site first"
        description="Tell us where the work is needed. You only have to do this once per location."
        action={
          <SiteFormDialog
            trigger={
              <Button>
                <Plus /> Add a site
              </Button>
            }
          />
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <SiteFormDialog
          trigger={
            <Button variant="link" size="sm">
              <Plus /> Add another site
            </Button>
          }
        />
      </div>

      <form
        noValidate
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="siteId">
          {(field) => (
            <RadioCardField
              field={field}
              label="Where is the work needed?"
              options={sites.map((site) => ({
                value: site.id,
                title: site.label,
                description: `${site.address}, ${site.city}`,
                meta: `Contact: ${site.contactName} · ${site.contactPhone}`,
              }))}
            />
          )}
        </form.Field>
        <WizardActions />
      </form>
    </div>
  );
}
