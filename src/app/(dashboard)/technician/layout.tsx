import type { ReactNode } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function TechnicianLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard roles={["TECHNICIAN"]}>
      <DashboardShell role="TECHNICIAN">{children}</DashboardShell>
    </AuthGuard>
  );
}
