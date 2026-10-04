"use client";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { ComponentProps } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export type FormFieldProps = Omit<
  ComponentProps<typeof Input>,
  "id" | "name" | "value" | "onChange" | "onBlur"
> & { field: AnyFieldApi; label: string; description?: string };

export default function TextField({
  field,
  label,
  description,
  ...inputProps
}: FormFieldProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        {...inputProps}
      />
      {description && !isInvalid && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
