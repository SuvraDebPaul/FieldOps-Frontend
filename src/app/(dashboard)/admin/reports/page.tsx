import type { Metadata } from "next";
import { Suspense } from "react";
import ReportsOverview from "@/components/modules/admin/reports-overview";
import PageHeader from "@/components/shared/page-header";
import { DashboardPageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = { title: "Reports" };

export default function AdminReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Service quality: customer ratings and technician performance."
      />
      <Suspense fallback={<DashboardPageSkeleton />}>
        <ReportsOverview />
      </Suspense>
    </>
  );
}
