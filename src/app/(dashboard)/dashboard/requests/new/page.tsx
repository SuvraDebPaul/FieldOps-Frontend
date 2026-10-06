import type { Metadata } from "next";
import { Suspense } from "react";
import RequestWizard, {
  WizardSkeleton,
} from "@/components/modules/request-wizard/request-wizard";
import PageHeader from "@/components/shared/page-header";

export const metadata: Metadata = { title: "New service request" };

export default function NewRequestPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <PageHeader
        title="New service request"
        description="Four quick steps. Your progress is saved if you leave or refresh."
      />
      {/* useSearchParams (via useQueryParams) → Suspense required for the static build */}
      <Suspense fallback={<WizardSkeleton />}>
        <RequestWizard />
      </Suspense>
    </div>
  );
}
