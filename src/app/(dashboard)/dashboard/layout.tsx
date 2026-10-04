// src/app/(dashboard)/dashboard/layout.tsx
import type { ReactNode } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard roles={["CUSTOMER"]}>
      <DashboardShell role="CUSTOMER">{children}</DashboardShell>
    </AuthGuard>
  );
}
