import type { Metadata } from "next";
import { Suspense } from "react";
import RequestList from "@/components/modules/requests/request-list";
import PageHeader from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = { title: "Service requests" };

export default function AdminRequestsPage() {
  return (
    <>
      <PageHeader
        title="Service requests"
        description="Review incoming requests, then approve and dispatch, or reject with a reason."
      />
      <Suspense fallback={<TableSkeleton columns={7} />}>
        <RequestList variant="admin" />
      </Suspense>
    </>
  );
}
