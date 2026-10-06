"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRequestWizardStore, WIZARD_STEPS } from "@/stores";

export default function WizardStepper() {
  const step = useRequestWizardStore((s) => s.step);
  const goToStep = useRequestWizardStore((s) => s.goToStep);

  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Request progress">
      {WIZARD_STEPS.map((item, index) => {
        const status =
          index < step ? "complete" : index === step ? "current" : "upcoming";

        return (
          <li key={item.key}>
            <button
              type="button"
              disabled={status === "upcoming"}
              onClick={() => goToStep(index)}
              aria-current={status === "current" ? "step" : undefined}
              className="flex w-full flex-col gap-2 text-left disabled:cursor-not-allowed"
            >
              <span
                className={cn(
                  "h-1.5 rounded-full transition-colors",
                  status === "upcoming" ? "bg-muted" : "bg-primary",
                )}
              />
              <span
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium sm:text-sm",
                  status === "upcoming"
                    ? "text-muted-foreground"
                    : "text-foreground",
                )}
              >
                {status === "complete" ? (
                  <CheckCircle2 className="size-4 text-primary" />
                ) : (
                  <span className="flex size-4 items-center justify-center rounded-full border text-[10px]">
                    {index + 1}
                  </span>
                )}
                <span className="hidden sm:inline">{item.title}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
