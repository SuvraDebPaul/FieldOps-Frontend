"use client";

import { useForm } from "@tanstack/react-form";
import RadioCardField from "@/components/form/fields/radio-card-field";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks";
import { useRequestWizardStore } from "@/stores";
import { formatCurrency, formatDuration } from "@/utils";
import { serviceStepSchema } from "@/validation";
import WizardActions from "./wizard-actions";
import { WIZARD_CATEGORY_PARAMS } from "./wizard.constants";

export default function StepService() {
  const categoryId = useRequestWizardStore((s) => s.draft.categoryId);
  const updateDraft = useRequestWizardStore((s) => s.updateDraft);
  const nextStep = useRequestWizardStore((s) => s.nextStep);
  const prevStep = useRequestWizardStore((s) => s.prevStep);
  const { data, isPending } = useCategories(WIZARD_CATEGORY_PARAMS);

  const form = useForm({
    defaultValues: { categoryId },
    validators: { onChange: serviceStepSchema },
    onSubmit: ({ value }) => {
      updateDraft(value);
      nextStep();
    },
  });

  if (isPending) return <Skeleton className="h-64 w-full rounded-xl" />;

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="categoryId">
        {(field) => (
          <RadioCardField
            field={field}
            label="What do you need done?"
            options={(data?.data ?? []).map((category) => ({
              value: category.id,
              title: category.name,
              description: category.description,
              meta: `${category.requiredSkill.name} · ${formatCurrency(
                category.baseCharge,
              )} base · ~${formatDuration(category.estimatedMins)}`,
            }))}
          />
        )}
      </form.Field>
      <WizardActions
        onBack={() => {
          updateDraft(form.state.values);
          prevStep();
        }}
      />
    </form>
  );
}
