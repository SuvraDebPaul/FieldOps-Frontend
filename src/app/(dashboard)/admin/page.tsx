// e.g. src/app/(dashboard)/admin/page.tsx
import LogoutButton from "@/components/auth/logout-button";

export default function AdminDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Admin dashboard</h1>
      <LogoutButton />
    </div>
  );
}
