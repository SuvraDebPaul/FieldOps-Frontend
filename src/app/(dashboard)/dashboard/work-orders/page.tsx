import type { Metadata } from "next";
import { Suspense } from "react";
import CustomerWorkOrderList from "@/components/modules/work-orders/customer-work-order-list";
import PageHeader from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = { title: "Work orders" };

export default function CustomerWorkOrdersPage() {
  return (
    <>
      <PageHeader
        title="Work orders"
        description="Follow each job live, from dispatch to payment."
      />
      <Suspense fallback={<TableSkeleton columns={6} />}>
        <CustomerWorkOrderList />
      </Suspense>
    </>
  );
}
