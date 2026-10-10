"use client";

import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePaymentStatus } from "@/hooks";
import { formatCurrency } from "@/utils";
import PayInvoiceButton from "./pay-invoice-button";
import PaymentResultCard from "./payment-result-card";

const POLL_TIMEOUT_MS = 30_000;

export default function PaymentSuccess() {
  const transactionId = useSearchParams().get("transactionId");
  const [waitedTooLong, setWaitedTooLong] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setWaitedTooLong(true), POLL_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  const { data: payment, isError } = usePaymentStatus(transactionId, {
    poll: !waitedTooLong,
  });

  const paymentsLink = (
    <Button asChild variant="outline">
      <Link href="/dashboard/payments">Go to payments</Link>
    </Button>
  );

  if (!transactionId || isError) {
    return (
      <PaymentResultCard
        icon={XCircle}
        tone="danger"
        title="We couldn't find this payment"
        description="The payment reference is missing or invalid. Check your payments page for the latest status."
        actions={paymentsLink}
      />
    );
  }

  if (!payment || payment.status === "INITIATED") {
    return waitedTooLong ? (
      <PaymentResultCard
        icon={Clock}
        tone="warning"
        title="Still confirming your payment"
        description="Stripe hasn't confirmed the payment with us yet. This usually takes a few seconds. Check your payments page shortly."
        actions={paymentsLink}
      />
    ) : (
      <PaymentResultCard
        icon={Loader2}
        spinning
        tone="info"
        title="Confirming your payment…"
        description="We're waiting for Stripe's secure confirmation. Please keep this page open."
      />
    );
  }

  if (payment.status === "SUCCESS") {
    return (
      <PaymentResultCard
        icon={CheckCircle2}
        tone="success"
        title="Payment successful"
        description={`Invoice ${payment.invoice.invoiceNo} is now paid. Thank you!`}
        actions={
          <>
            <Button asChild>
              <Link
                href={`/dashboard/work-orders?view=${payment.invoice.workOrderId}`}
              >
                Rate this job
              </Link>
            </Button>
            {paymentsLink}
          </>
        }
      >
        <dl className="space-y-2 text-left text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Amount</dt>
            <dd className="font-medium">{formatCurrency(payment.amount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Work order</dt>
            <dd>{payment.invoice.workOrder.code}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Reference</dt>
            <dd className="truncate font-mono text-xs">
              {payment.transactionId}
            </dd>
          </div>
        </dl>
      </PaymentResultCard>
    );
  }

  return (
    <PaymentResultCard
      icon={XCircle}
      tone="danger"
      title="Payment didn't go through"
      description="Your card wasn't charged. You can try again."
      actions={
        <>
          {payment.invoice.status === "DUE" && (
            <PayInvoiceButton
              invoiceId={payment.invoiceId}
              amount={payment.amount}
            />
          )}
          {paymentsLink}
        </>
      }
    />
  );
}
