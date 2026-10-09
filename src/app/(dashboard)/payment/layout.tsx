import type { ReactNode } from "react";
import AuthGuard from "@/components/auth/auth-guard";

export default function PaymentLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <main className="flex min-h-svh items-center justify-center bg-muted/30 px-4 py-10">
        {children}
      </main>
    </AuthGuard>
  );
}
