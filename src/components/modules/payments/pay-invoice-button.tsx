"use client";

import { CreditCard } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useInitiatePayment } from "@/hooks";
import { formatCurrency } from "@/utils";

type PayInvoiceButtonProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  invoiceId: string;
  amount: string;
};

export default function PayInvoiceButton({
  invoiceId,
  amount,
  ...buttonProps
}: PayInvoiceButtonProps) {
  const initiatePayment = useInitiatePayment();
  const isBusy = initiatePayment.isPending || initiatePayment.isSuccess;

  return (
    <Button
      onClick={() => initiatePayment.mutate(invoiceId)}
      disabled={isBusy}
      {...buttonProps}
    >
      {isBusy ? <Spinner /> : <CreditCard />}
      {initiatePayment.isSuccess
        ? "Redirecting to Stripe…"
        : `Pay ${formatCurrency(amount)}`}
    </Button>
  );
}
