import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentCancelled from "@/components/modules/payments/payment-cancelled";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Payment cancelled",
  robots: { index: false },
};

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={<Skeleton className="h-72 w-full max-w-md rounded-xl" />}
    >
      <PaymentCancelled />
    </Suspense>
  );
}
