"use client";

import { Clock, Info, type LucideIcon, Play, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useChangeWorkOrderStatus } from "@/hooks";
import type { WorkOrderDetail, WorkOrderStatus } from "@/types";
import CompleteJobDialog from "./complete-job-dialog";
import LogPartDialog from "./log-part-dialog";

const NEXT_STEP: Partial<
  Record<
    WorkOrderStatus,
    { status: WorkOrderStatus; label: string; hint: string; icon: LucideIcon }
  >
> = {
  SCHEDULED: {
    status: "EN_ROUTE",
    label: "Start travelling",
    hint: "Tell the customer you're on your way.",
    icon: Truck,
  },
  EN_ROUTE: {
    status: "IN_PROGRESS",
    label: "Arrived, start work",
    hint: "Starts the billable clock (your actual start time).",
    icon: Play,
  },
};

const WAITING_MESSAGE: Partial<Record<WorkOrderStatus, string>> = {
  ASSIGNED: "Waiting for the dispatcher to confirm the schedule.",
  COMPLETED: "Job completed. The dispatcher will issue the invoice.",
  INVOICED: "Invoice sent to the customer.",
  PAID: "Paid by the customer. Nice work!",
  CANCELLED: "This job was cancelled by the dispatcher.",
};

export default function TechnicianActions({
  workOrder,
}: {
  workOrder: WorkOrderDetail;
}) {
  const changeStatus = useChangeWorkOrderStatus();
  const next = NEXT_STEP[workOrder.status];
  const waiting = WAITING_MESSAGE[workOrder.status];
  const canLogParts =
    workOrder.status === "EN_ROUTE" || workOrder.status === "IN_PROGRESS";

  if (waiting) {
    return (
      <div className="flex gap-2 rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
        {workOrder.status === "ASSIGNED" ? (
          <Clock className="size-4 shrink-0" />
        ) : (
          <Info className="size-4 shrink-0" />
        )}
        {waiting}
      </div>
    );
  }

  const NextIcon = next?.icon;

  return (
    <section className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <h3 className="text-sm font-semibold">Next step</h3>
      {next && <p className="text-sm text-muted-foreground">{next.hint}</p>}
      <div className="flex flex-wrap gap-2">
        {next && NextIcon && (
          <Button
            onClick={() =>
              changeStatus.mutate({
                workOrderId: workOrder.id,
                status: next.status,
              })
            }
            disabled={changeStatus.isPending}
          >
            {changeStatus.isPending ? <Spinner /> : <NextIcon />} {next.label}
          </Button>
        )}
        {workOrder.status === "IN_PROGRESS" && (
          <CompleteJobDialog workOrder={workOrder} />
        )}
        {canLogParts && <LogPartDialog workOrderId={workOrder.id} />}
      </div>
    </section>
  );
}
