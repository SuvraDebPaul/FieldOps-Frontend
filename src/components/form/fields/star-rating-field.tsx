"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import { Star } from "lucide-react";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export default function StarRatingField({
  field,
  label,
}: {
  field: AnyFieldApi;
  label: string;
}) {
  const value = Number(field.state.value);
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldSet data-invalid={isInvalid}>
      <FieldLegend variant="label">{label}</FieldLegend>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer">
            <input
              type="radio"
              name={field.name}
              value={n}
              checked={value === n}
              onChange={() => field.handleChange(n)}
              onBlur={field.handleBlur}
              className="peer sr-only"
            />
            <Star
              aria-hidden
              className={cn(
                "size-8 rounded transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                n <= value
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/40 hover:text-amber-300",
              )}
            />
            <span className="sr-only">
              {n} star{n > 1 ? "s" : ""}
            </span>
          </label>
        ))}
      </div>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  );
}
