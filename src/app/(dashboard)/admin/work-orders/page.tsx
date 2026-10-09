import type { Metadata } from "next";
import { Suspense } from "react";
import AdminWorkOrderList from "@/components/modules/admin/admin-work-order-list";
import PageHeader from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = { title: "Work orders" };

export default function AdminWorkOrdersPage() {
  return (
    <>
      <PageHeader
        title="Work orders"
        description="Confirm schedules, reschedule or cancel jobs, and issue invoices."
      />
      <Suspense fallback={<TableSkeleton columns={7} />}>
        <AdminWorkOrderList />
      </Suspense>
    </>
  );
}
