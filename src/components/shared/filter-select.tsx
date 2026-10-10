"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterSelectProps {
  value: string;
  onValueChange: (value: string | null) => void;
  options: { value: string; label: string }[];
  allLabel: string;
  label: string;
  className?: string;
}

export default function FilterSelect({
  value,
  onValueChange,
  options,
  allLabel,
  label,
  className,
}: FilterSelectProps) {
  return (
    <Select
      value={value || "all"}
      onValueChange={(next) => onValueChange(next === "all" ? null : next)}
    >
      <SelectTrigger
        className={cn("w-full sm:w-44", className)}
        aria-label={label}
      >
        <SelectValue placeholder={allLabel} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
