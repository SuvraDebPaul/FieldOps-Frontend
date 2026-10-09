"use client";

import StatusBadge from "@/components/shared/status-badge";
import { INVOICE_STATUS_META } from "@/constants/status.constants";
import type { WorkOrderDetail } from "@/types";
import { formatDate } from "@/utils";
import FeedbackSection from "./feedback-section";
import InvoiceBreakdown from "./invoice-breakdown";
import PayInvoiceButton from "./pay-invoice-button";

export default function CustomerJobPanel({
  workOrder,
}: {
  workOrder: WorkOrderDetail;
}) {
  const { invoice } = workOrder;

  return (
    <>
      {invoice && (
        <section className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">
              Invoice {invoice.invoiceNo}
            </h3>
            <StatusBadge {...INVOICE_STATUS_META[invoice.status]} />
          </div>
          <InvoiceBreakdown invoice={invoice} />
          {invoice.status === "DUE" && (
            <>
              <p className="text-xs text-muted-foreground">
                Due {formatDate(invoice.dueDate)}
              </p>
              <PayInvoiceButton
                invoiceId={invoice.id}
                amount={invoice.totalAmount}
                className="w-full"
              />
            </>
          )}
        </section>
      )}

      {workOrder.status === "PAID" && (
        <FeedbackSection workOrderId={workOrder.id} />
      )}
    </>
  );
}
