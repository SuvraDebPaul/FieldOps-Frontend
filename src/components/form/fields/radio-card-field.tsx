"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export interface RadioCardOption {
  value: string;
  title: string;
  description?: string | null;
  meta?: ReactNode;
}

interface RadioCardFieldProps {
  field: AnyFieldApi;
  label: string;
  options: RadioCardOption[];
  className?: string;
}

export default function RadioCardField({
  field,
  label,
  options,
  className,
}: RadioCardFieldProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldSet data-invalid={isInvalid}>
      <FieldLegend>{label}</FieldLegend>
      <RadioGroup
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        aria-invalid={isInvalid}
        className={cn("grid gap-3 sm:grid-cols-2", className)}
      >
        {options.map((option) => {
          const id = `${field.name}-${option.value}`;
          return (
            <Label
              key={option.value}
              htmlFor={id}
              className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 leading-normal font-normal transition-colors hover:bg-accent/50 has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
            >
              <RadioGroupItem
                id={id}
                value={option.value}
                onBlur={field.handleBlur}
                className="mt-0.5"
              />
              <span className="min-w-0 space-y-1">
                <span className="block font-medium">{option.title}</span>
                {option.description && (
                  <span className="block text-sm text-muted-foreground">
                    {option.description}
                  </span>
                )}
                {option.meta && (
                  <span className="block text-xs text-muted-foreground">
                    {option.meta}
                  </span>
                )}
              </span>
            </Label>
          );
        })}
      </RadioGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  );
}
