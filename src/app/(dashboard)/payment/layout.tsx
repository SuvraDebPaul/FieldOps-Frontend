// src/app/(dashboard)/payment/layout.tsx: any logged-in user
import type { ReactNode } from "react";
import AuthGuard from "@/components/auth/auth-guard";

export default function PaymentLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
