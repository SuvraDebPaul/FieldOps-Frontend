import type { Priority } from "@/types";

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "LOW", label: "Low: can wait a week" },
  { value: "NORMAL", label: "Normal: within a few days" },
  { value: "HIGH", label: "High: production is affected" },
  { value: "CRITICAL", label: "Critical: safety risk or line down" },
];
