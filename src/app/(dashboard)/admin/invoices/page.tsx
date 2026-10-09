import type { Metadata } from "next";
import { Suspense } from "react";
import InvoiceList from "@/components/modules/payments/invoice-list";
import PaymentSummary from "@/components/modules/payments/payment-summary";
import PageHeader from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = { title: "Invoices" };

export default function AdminInvoicesPage() {
  return (
    <>
      <PageHeader
        title="Invoices"
        description="Every invoice issued, its payment attempts and what's still outstanding."
      />
      <PaymentSummary basePath="/admin/invoices" />
      <Suspense fallback={<TableSkeleton columns={7} />}>
        <InvoiceList variant="admin" />
      </Suspense>
    </>
  );
}
