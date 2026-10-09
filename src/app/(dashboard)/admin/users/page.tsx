import type { Metadata } from "next";
import { Suspense } from "react";
import UserList from "@/components/modules/admin/user-list";
import PageHeader from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = { title: "Users" };

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader
        title="Users"
        description="Every account on the platform. Change roles, suspend or reactivate access."
      />
      <Suspense fallback={<TableSkeleton columns={6} />}>
        <UserList />
      </Suspense>
    </>
  );
}
