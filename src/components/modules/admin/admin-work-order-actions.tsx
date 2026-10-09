"use client";

import { differenceInMinutes } from "date-fns";
import { CalendarCheck, Receipt } from "lucide-react";
import Link from "next/link";
import InvoiceBreakdown from "@/components/modules/payments/invoice-breakdown";
import StatusBadge from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { INVOICE_STATUS_META } from "@/constants/status.constants";
import { useChangeWorkOrderStatus, useGenerateInvoice } from "@/hooks";
import type { WorkOrderDetail, WorkOrderStatus } from "@/types";
import { formatCurrency, formatDuration } from "@/utils";
import CancelJobDialog from "./cancel-job-dialog";
import RescheduleDialog from "./reschedule-dialog";

const ACTIVE: WorkOrderStatus[] = [
  "ASSIGNED",
  "SCHEDULED",
  "EN_ROUTE",
  "IN_PROGRESS",
];

export default function AdminWorkOrderActions({
  workOrder,
}: {
  workOrder: WorkOrderDetail;
}) {
  const changeStatus = useChangeWorkOrderStatus();
  const generateInvoice = useGenerateInvoice();

  const { status, invoice, technician } = workOrder;
  const isActive = ACTIVE.includes(status);
  const minutesOnSite =
    workOrder.actualStart && workOrder.actualEnd
      ? differenceInMinutes(
          new Date(workOrder.actualEnd),
          new Date(workOrder.actualStart),
        )
      : 0;

  return (
    <>
      {(isActive || status === "COMPLETED") && (
        <section className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <h3 className="text-sm font-semibold">Dispatcher actions</h3>

          {status === "COMPLETED" && (
            <p className="text-sm text-muted-foreground">
              Billed from {formatDuration(Math.max(minutesOnSite, 30))} on site
              at {formatCurrency(technician.hourlyRate)}/h, plus{" "}
              {workOrder.parts.length} part line(s) and 15% VAT.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {status === "ASSIGNED" && (
              <Button
                onClick={() =>
                  changeStatus.mutate({
                    workOrderId: workOrder.id,
                    status: "SCHEDULED",
                    note: "Schedule confirmed by dispatcher",
                  })
                }
                disabled={changeStatus.isPending}
              >
                {changeStatus.isPending ? <Spinner /> : <CalendarCheck />}{" "}
                Confirm schedule
              </Button>
            )}
            {status === "COMPLETED" && (
              <Button
                onClick={() => generateInvoice.mutate(workOrder.id)}
                disabled={generateInvoice.isPending}
              >
                {generateInvoice.isPending ? <Spinner /> : <Receipt />} Generate
                invoice
              </Button>
            )}
            {isActive && <RescheduleDialog workOrder={workOrder} />}
            {isActive && <CancelJobDialog workOrder={workOrder} />}
          </div>
        </section>
      )}

      {invoice && (
        <section className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">
              Invoice {invoice.invoiceNo}
            </h3>
            <StatusBadge {...INVOICE_STATUS_META[invoice.status]} />
          </div>
          <InvoiceBreakdown invoice={invoice} />
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/invoices?view=${invoice.id}`}>
              Open invoice
            </Link>
          </Button>
        </section>
      )}
    </>
  );
}
