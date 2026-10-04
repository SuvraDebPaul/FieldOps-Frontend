// src/app/(dashboard)/technician/layout.tsx
import type { ReactNode } from "react";
import AuthGuard from "@/components/auth/auth-guard";

export default function TechnicianLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthGuard roles={["TECHNICIAN"]}>{children}</AuthGuard>;
}
