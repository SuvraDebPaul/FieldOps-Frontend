"use client";

import { useForm } from "@tanstack/react-form";
import { type ReactNode, useState } from "react";
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
import { useCreateCategory, useSkills, useUpdateCategory } from "@/hooks";
import type { CreateCategoryPayload, ServiceCategory } from "@/types";
import { type CategoryFormValues, categorySchema } from "@/validation";

interface CategoryFormDialogProps {
  category?: ServiceCategory;
  trigger: ReactNode;
}

export default function CategoryFormDialog({
  category,
  trigger,
}: CategoryFormDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {category ? `Edit ${category.name}` : "New service"}
          </DialogTitle>
          <DialogDescription>
            Customers choose from these services. Only technicians with the
            required skill can be assigned.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm category={category} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function CategoryForm({
  category,
  onDone,
}: {
  category?: ServiceCategory;
  onDone: () => void;
}) {
  const { data: skills = [] } = useSkills();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isPending = createCategory.isPending || updateCategory.isPending;

  const defaultValues: CategoryFormValues = {
    name: category?.name ?? "",
    description: category?.description ?? "",
    requiredSkillId: category?.requiredSkillId ?? "",
    baseCharge: category ? String(Number(category.baseCharge)) : "",
    estimatedMins: category ? String(category.estimatedMins) : "60",
  };

  const form = useForm({
    defaultValues,
    validators: { onChange: categorySchema },
    onSubmit: ({ value }) => {
      const payload: CreateCategoryPayload = {
        name: value.name.trim(),
        description: value.description.trim() || undefined,
        requiredSkillId: value.requiredSkillId,
        baseCharge: Number(value.baseCharge),
        estimatedMins: Number(value.estimatedMins),
      };
      const onSuccess = () => {
        toast.success(category ? "Service updated" : "Service added");
        onDone();
      };
      if (category)
        updateCategory.mutate(
          { categoryId: category.id, ...payload },
          { onSuccess },
        );
      else createCategory.mutate(payload, { onSuccess });
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
        <form.Field name="name">
          {(field) => <TextField field={field} label="Service name" />}
        </form.Field>
        <form.Field name="description">
          {(field) => (
            <TextareaField
              field={field}
              label="Description (optional)"
              rows={3}
              maxLength={1000}
            />
          )}
        </form.Field>
        <form.Field name="requiredSkillId">
          {(field) => (
            <SelectField
              field={field}
              label="Required skill"
              placeholder="Choose a skill"
              options={skills.map((s) => ({ value: s.id, label: s.name }))}
            />
          )}
        </form.Field>
        <div className="grid grid-cols-2 gap-4">
          <form.Field name="baseCharge">
            {(field) => (
              <TextField
                field={field}
                label="Base charge (USD)"
                type="number"
                min={0}
                step="0.01"
              />
            )}
          </form.Field>
          <form.Field name="estimatedMins">
            {(field) => (
              <TextField
                field={field}
                label="Estimated minutes"
                type="number"
                min={1}
                step={1}
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
            {isPending && <Spinner />}{" "}
            {category ? "Save changes" : "Add service"}
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
