import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/form/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to FieldOps or try a one-click demo account.",
};

export default function LoginPage() {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <Suspense fallback={<Skeleton className="h-140 w-full rounded-xl" />}>
          <LoginForm />
        </Suspense>
      </div>
    </section>
  );
}
