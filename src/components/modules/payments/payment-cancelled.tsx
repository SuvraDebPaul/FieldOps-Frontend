"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePaymentStatus } from "@/hooks";
import PayInvoiceButton from "./pay-invoice-button";
import PaymentResultCard from "./payment-result-card";

export default function PaymentCancelled() {
  const transactionId = useSearchParams().get("transactionId");
  const { data: payment } = usePaymentStatus(transactionId, { poll: false });

  return (
    <PaymentResultCard
      icon={XCircle}
      tone="warning"
      title="Payment cancelled"
      description="You left Stripe checkout before paying. No money was taken."
      actions={
        <>
          {payment?.invoice.status === "DUE" && (
            <PayInvoiceButton
              invoiceId={payment.invoiceId}
              amount={payment.amount}
            />
          )}
          <Button asChild variant="outline">
            <Link href="/dashboard/payments">Back to payments</Link>
          </Button>
        </>
      }
    />
  );
}
