"use client";

import { CheckCircle2, Wallet } from "lucide-react";
import StatCard from "@/components/shared/stat-card";
import { useInvoices } from "@/hooks";
import { formatCurrency } from "@/utils";

export default function PaymentSummary({
  basePath = "/dashboard/payments",
}: {
  basePath?: string;
}) {
  const due = useInvoices({ status: "DUE", limit: 100 });
  const paid = useInvoices({ status: "PAID", limit: 1 });

  const outstanding = (due.data?.data ?? []).reduce(
    (sum, inv) => sum + Number(inv.totalAmount),
    0,
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatCard
        label="Outstanding balance"
        value={formatCurrency(outstanding)}
        hint={`${due.data?.meta.total ?? 0} invoice(s) due`}
        icon={Wallet}
        isLoading={due.isPending}
        href={`${basePath}?status=DUE`}
      />
      <StatCard
        label="Paid invoices"
        value={paid.data?.meta.total ?? 0}
        icon={CheckCircle2}
        isLoading={paid.isPending}
        href={`${basePath}?status=PAID`}
      />
    </div>
  );
}
