import type { Metadata } from "next";
import { Suspense } from "react";
import InvoiceList from "@/components/modules/payments/invoice-list";
import PaymentSummary from "@/components/modules/payments/payment-summary";
import PageHeader from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = { title: "Payments" };

export default function PaymentsPage() {
  return (
    <>
      <PageHeader
        title="Payments"
        description="Your invoices, payment attempts and outstanding balance."
      />
      <PaymentSummary />
      <Suspense fallback={<TableSkeleton columns={6} />}>
        <InvoiceList />
      </Suspense>
    </>
  );
}
