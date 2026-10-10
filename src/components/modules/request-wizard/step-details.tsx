"use client";

import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import SelectField from "@/components/form/fields/select-field";
import TextField from "@/components/form/fields/text-field";
import TextareaField from "@/components/form/fields/textarea-field";
import { FieldGroup } from "@/components/ui/field";
import { PRIORITY_OPTIONS } from "@/constants/request.constants";
import { useRequestWizardStore } from "@/stores";
import { type DetailsStepValues, detailsStepSchema } from "@/validation";
import WizardActions from "./wizard-actions";

export default function StepDetails() {
  const draft = useRequestWizardStore((s) => s.draft);
  const updateDraft = useRequestWizardStore((s) => s.updateDraft);
  const nextStep = useRequestWizardStore((s) => s.nextStep);
  const prevStep = useRequestWizardStore((s) => s.prevStep);

  const defaultValues: DetailsStepValues = {
    title: draft.title,
    description: draft.description,
    priority: draft.priority,
    preferredAt: draft.preferredAt,
  };

  const form = useForm({
    defaultValues,
    validators: { onChange: detailsStepSchema },
    onSubmit: ({ value }) => {
      updateDraft(value);
      nextStep();
    },
  });

  const minDateTime = format(new Date(), "yyyy-MM-dd'T'HH:mm");

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
            <TextField
              field={field}
              label="Short title"
              placeholder="e.g. Chiller No. 2 tripping on high pressure"
              maxLength={150}
            />
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <TextareaField
              field={field}
              label="What's happening?"
              rows={6}
              maxLength={2000}
              placeholder="Equipment, symptoms, when it started, anything already tried…"
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
                label="Preferred time (optional)"
                type="datetime-local"
                min={minDateTime}
                description="The dispatcher confirms the exact slot."
              />
            )}
          </form.Field>
        </div>

        <WizardActions
          onBack={() => {
            updateDraft(form.state.values);
            prevStep();
          }}
        />
      </FieldGroup>
    </form>
  );
}
