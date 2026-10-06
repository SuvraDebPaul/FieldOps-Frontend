"use client";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { PRIORITY_OPTIONS } from "@/constants/request.constants";
import { useCategories, useCreateRequest, useSites } from "@/hooks";
import { type RequestDraft, useRequestWizardStore } from "@/stores";
import type { CreateRequestPayload } from "@/types";
import { formatCurrency, formatDateTime } from "@/utils";
import { createRequestSchema } from "@/validation";
import WizardActions from "./wizard-actions";
import {
  STEP_OF_FIELD,
  WIZARD_CATEGORY_PARAMS,
  WIZARD_SITE_PARAMS,
} from "./wizard.constants";

// Draft (form-friendly) → payload (API-friendly)
function toPayload(draft: RequestDraft): CreateRequestPayload {
  return {
    siteId: draft.siteId,
    categoryId: draft.categoryId,
    title: draft.title.trim(),
    description: draft.description.trim(),
    priority: draft.priority,
    // "2026-10-06T14:30" (local) → "2026-10-06T08:30:00.000Z" (what z.iso.datetime expects)
    preferredAt: draft.preferredAt
      ? new Date(draft.preferredAt).toISOString()
      : undefined,
  };
}

function ReviewRow({
  label,
  onEdit,
  children,
}: {
  label: string;
  onEdit?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr_auto] sm:items-start sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm">{children}</dd>
      {onEdit && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="w-fit"
        >
          <Pencil /> Edit
        </Button>
      )}
    </div>
  );
}

export default function StepReview() {
  const router = useRouter();
  // Several values at once → useShallow (Rule 2 from the Zustand lesson)
  const { draft, goToStep, prevStep, reset } = useRequestWizardStore(
    useShallow((s) => ({
      draft: s.draft,
      goToStep: s.goToStep,
      prevStep: s.prevStep,
      reset: s.reset,
    })),
  );

  // Same params as Steps 1 and 2 → read straight from the cache, no new request
  const { data: sitesRes } = useSites(WIZARD_SITE_PARAMS);
  const { data: categoriesRes } = useCategories(WIZARD_CATEGORY_PARAMS);
  const createRequest = useCreateRequest();

  const site = sitesRes?.data.find((s) => s.id === draft.siteId);
  const category = categoriesRes?.data.find((c) => c.id === draft.categoryId);
  const priority = PRIORITY_OPTIONS.find((p) => p.value === draft.priority);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Last safety net: the draft came from storage and could be stale or edited
    const result = createRequestSchema.safeParse(draft);
    if (!result.success) {
      const issue = result.error.issues[0];
      toast.error(issue.message);
      goToStep(STEP_OF_FIELD[String(issue.path[0])] ?? 2);
      return;
    }

    createRequest.mutate(toPayload(draft), {
      onSuccess: ({ data }) => {
        toast.success(`Request ${data.code} submitted`, {
          description: "A dispatcher will review it and assign a technician.",
        });
        router.push("/dashboard/requests");
        reset(); // clear the Zustand draft and its sessionStorage copy
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <dl className="divide-y rounded-xl border">
        <ReviewRow label="Site" onEdit={() => goToStep(0)}>
          {site ? (
            <>
              <p className="font-medium">{site.label}</p>
              <p className="text-muted-foreground">
                {site.address}, {site.city}
              </p>
            </>
          ) : (
            "—"
          )}
        </ReviewRow>
        <ReviewRow label="Service" onEdit={() => goToStep(1)}>
          {category ? (
            <>
              <p className="font-medium">{category.name}</p>
              <p className="text-muted-foreground">
                {category.requiredSkill.name} ·{" "}
                {formatCurrency(category.baseCharge)} base
              </p>
            </>
          ) : (
            "—"
          )}
        </ReviewRow>
        <ReviewRow label="Title" onEdit={() => goToStep(2)}>
          {draft.title}
        </ReviewRow>
        <ReviewRow label="Description">
          <p className="whitespace-pre-line">{draft.description}</p>
        </ReviewRow>
        <ReviewRow label="Priority">{priority?.label}</ReviewRow>
        <ReviewRow label="Preferred time">
          {draft.preferredAt
            ? formatDateTime(draft.preferredAt)
            : "Flexible: the dispatcher will propose a slot"}
        </ReviewRow>
      </dl>

      <p className="text-xs text-muted-foreground">
        You can edit or cancel this request until a dispatcher approves it.
      </p>

      <WizardActions
        onBack={prevStep}
        submitLabel="Submit request"
        isSubmitting={createRequest.isPending}
      />
    </form>
  );
}
