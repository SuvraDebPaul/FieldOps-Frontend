// src/app/(dashboard)/dashboard/layout.tsx
import type { ReactNode } from "react";
import AuthGuard from "@/components/auth/auth-guard";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return <AuthGuard roles={["CUSTOMER"]}>{children}</AuthGuard>;
}
