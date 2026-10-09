"use client";

import DetailItem from "@/components/shared/detail-item";
import StatusBadge from "@/components/shared/status-badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  INVOICE_STATUS_META,
  PAYMENT_STATUS_META,
} from "@/constants/status.constants";
import { useInvoice, useQueryParams } from "@/hooks";
import type { Invoice } from "@/types";
import { formatCurrency, formatDate, formatDateTime } from "@/utils";
import PartsList from "../work-orders/parts-list";
import InvoiceBreakdown from "./invoice-breakdown";
import PayInvoiceButton from "./pay-invoice-button";

export default function InvoiceDetailSheet({
  canPay = false,
}: {
  canPay?: boolean;
}) {
  const { get, setParams } = useQueryParams();
  const invoiceId = get("view") || null;
  const { data: invoice, isError } = useInvoice(invoiceId);

  return (
    <Sheet
      open={Boolean(invoiceId)}
      onOpenChange={(open) => {
        if (!open) setParams({ view: null });
      }}
    >
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {invoice ? (
          <InvoiceDetails invoice={invoice} canPay={canPay} />
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>Invoice</SheetTitle>
              <SheetDescription>
                {isError ? "This invoice couldn't be loaded." : "Loading…"}
              </SheetDescription>
            </SheetHeader>
            {!isError && <Skeleton className="mx-4 h-64" />}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function InvoiceDetails({
  invoice,
  canPay,
}: {
  invoice: Invoice;
  canPay: boolean;
}) {
  const { workOrder } = invoice;

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-2">
          <StatusBadge {...INVOICE_STATUS_META[invoice.status]} />
        </div>
        <SheetTitle className="text-xl">Invoice {invoice.invoiceNo}</SheetTitle>
        <SheetDescription>
          {workOrder.request.category.name} · {workOrder.code}
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 px-4 pb-4">
        <dl className="grid grid-cols-2 gap-4">
          <DetailItem label="Issued">{formatDate(invoice.issuedAt)}</DetailItem>
          <DetailItem label={invoice.paidAt ? "Paid" : "Due"}>
            {formatDate(invoice.paidAt ?? invoice.dueDate)}
          </DetailItem>
          <DetailItem label="Site">{workOrder.request.site.label}</DetailItem>
          <DetailItem label="Technician">
            {workOrder.technician.user.name}
          </DetailItem>
        </dl>

        <section className="space-y-3 rounded-lg border p-4">
          <h3 className="text-sm font-semibold">Breakdown</h3>
          <InvoiceBreakdown invoice={invoice} />
          <p className="text-xs text-muted-foreground">
            Labour at {formatCurrency(workOrder.technician.hourlyRate)}/h from
            actual time on site.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Parts</h3>
          <PartsList parts={workOrder.parts} />
        </section>

        {invoice.payments.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Payment attempts</h3>
            <ul className="divide-y rounded-lg border text-sm">
              {invoice.payments.map((payment) => (
                <li
                  key={payment.id}
                  className="flex items-center justify-between gap-3 px-3 py-2"
                >
                  <div>
                    <p>{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(payment.createdAt)}
                    </p>
                  </div>
                  <StatusBadge {...PAYMENT_STATUS_META[payment.status]} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {canPay && invoice.status === "DUE" && (
        <SheetFooter className="border-t">
          <PayInvoiceButton
            invoiceId={invoice.id}
            amount={invoice.totalAmount}
          />
        </SheetFooter>
      )}
    </>
  );
}
