// e.g. src/app/(dashboard)/admin/page.tsx
import PageHeader from "@/components/shared/page-header";

export default function AdminDashboardPage() {
  return (
    <PageHeader
      title="Operations overview"
      description="Requests, work orders and revenue at a glance."
    />
  );
}
