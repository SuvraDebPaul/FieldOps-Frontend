import type { Metadata } from "next";
import AdminOverview from "@/components/modules/admin/admin-overview";
import PageHeader from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Operations overview" };

export default function AdminOverviewPage() {
  return (
    <>
      <PageHeader
        title="Operations overview"
        description="Requests, jobs and revenue at a glance."
      />
      <AdminOverview />
    </>
  );
}
