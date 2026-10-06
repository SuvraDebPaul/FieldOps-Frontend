import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import RequestList from "@/components/modules/requests/request-list";
import PageHeader from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "My requests" };

export default function RequestsPage() {
  return (
    <>
      <PageHeader
        title="My requests"
        description="Track every request from submission to scheduled job."
        actions={
          <Button asChild>
            <Link href="/dashboard/requests/new">
              <Plus /> New request
            </Link>
          </Button>
        }
      />
      <Suspense fallback={<TableSkeleton columns={6} />}>
        <RequestList />
      </Suspense>
    </>
  );
}
