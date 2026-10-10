"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryParams } from "@/hooks";
import { useRequestWizardStore, WIZARD_STEPS } from "@/stores";
import StepDetails from "./step-details";
import StepReview from "./step-review";
import StepService from "./step-service";
import StepSite from "./step-site";
import { STEP_HINTS } from "./wizard.constants";
import WizardStepper from "./wizard-stepper";

const STEP_COMPONENTS = [StepSite, StepService, StepDetails, StepReview];

export function WizardSkeleton() {
  return <Skeleton className="h-[480px] w-full rounded-xl" />;
}

export default function RequestWizard() {
  const step = useRequestWizardStore((s) => s.step);
  const hasHydrated = useRequestWizardStore((s) => s.hasHydrated);
  const hasDraft = useRequestWizardStore(
    (s) => s.step > 0 || s.draft.siteId !== "",
  );
  const reset = useRequestWizardStore((s) => s.reset);

  const { get, setParams } = useQueryParams();
  const categoryIdFromUrl = get("categoryId");

  useEffect(() => {
    if (!hasHydrated || !categoryIdFromUrl) return;
    useRequestWizardStore
      .getState()
      .updateDraft({ categoryId: categoryIdFromUrl });
    setParams({ categoryId: null });
  }, [hasHydrated, categoryIdFromUrl, setParams]);

  if (!hasHydrated) return <WizardSkeleton />;

  const StepComponent = STEP_COMPONENTS[step];

  return (
    <Card>
      <CardHeader className="space-y-6">
        <WizardStepper />
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground sm:hidden">
              Step {step + 1} of {WIZARD_STEPS.length}
            </p>
            <CardTitle>{WIZARD_STEPS[step].title}</CardTitle>
            <CardDescription>{STEP_HINTS[step]}</CardDescription>
          </div>
          {hasDraft && (
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw /> Start over
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <StepComponent />
      </CardContent>
    </Card>
  );
}
