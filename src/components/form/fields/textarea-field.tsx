"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import type { ComponentProps } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

type TextareaFieldProps = Omit<
  ComponentProps<typeof Textarea>,
  "id" | "name" | "value" | "onChange" | "onBlur"
> & {
  field: AnyFieldApi;
  label: string;
};

export default function TextareaField({
  field,
  label,
  maxLength,
  ...textareaProps
}: TextareaFieldProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const length = String(field.state.value ?? "").length;

  return (
    <Field data-invalid={isInvalid}>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {maxLength && (
          <span className="text-xs text-muted-foreground">
            {length}/{maxLength}
          </span>
        )}
      </div>
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        maxLength={maxLength}
        {...textareaProps}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
