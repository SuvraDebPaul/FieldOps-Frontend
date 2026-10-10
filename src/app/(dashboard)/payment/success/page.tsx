import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentSuccess from "@/components/modules/payments/payment-success";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Payment status",
  robots: { index: false },
};

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={<Skeleton className="h-80 w-full max-w-md rounded-xl" />}
    >
      <PaymentSuccess />
    </Suspense>
  );
}
