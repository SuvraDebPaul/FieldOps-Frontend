"use client";

import type { ReactNode } from "react";
import DetailItem from "@/components/shared/detail-item";
import StatusBadge from "@/components/shared/status-badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { WORK_ORDER_STATUS_META } from "@/constants/status.constants";
import { useQueryParams, useWorkOrder } from "@/hooks";
import type { WorkOrderDetail } from "@/types";
import { formatDateTime, formatTime } from "@/utils";
import PartsList from "./parts-list";
import WorkOrderTimeline from "./work-order-timeline";

interface WorkOrderDetailSheetProps {
  renderPanel?: (workOrder: WorkOrderDetail) => ReactNode;
}

export default function WorkOrderDetailSheet({
  renderPanel,
}: WorkOrderDetailSheetProps) {
  const { get, setParams } = useQueryParams();
  const workOrderId = get("view") || null;
  const { data: workOrder, isError } = useWorkOrder(workOrderId);

  return (
    <Sheet
      open={Boolean(workOrderId)}
      onOpenChange={(open) => {
        if (!open) setParams({ view: null });
      }}
    >
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        {workOrder ? (
          <WorkOrderDetails
            workOrder={workOrder}
            panel={renderPanel?.(workOrder)}
          />
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>Work order</SheetTitle>
              <SheetDescription>
                {isError ? "This work order couldn't be loaded." : "Loading…"}
              </SheetDescription>
            </SheetHeader>
            {!isError && (
              <div className="space-y-3 px-4">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-56 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function WorkOrderDetails({
  workOrder,
  panel,
}: {
  workOrder: WorkOrderDetail;
  panel: ReactNode;
}) {
  const { request, technician } = workOrder;

  return (
    <>
      <SheetHeader>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {workOrder.code}
          </span>
          <StatusBadge {...WORK_ORDER_STATUS_META[workOrder.status]} />
        </div>
        <SheetTitle className="text-xl">{request.title}</SheetTitle>
        <SheetDescription>
          {request.category.name} · {request.code}
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 px-4 pb-6">
        {panel}

        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Progress</h3>
          <WorkOrderTimeline workOrder={workOrder} />
        </section>

        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailItem label="Scheduled">
            {formatDateTime(workOrder.scheduledStart)} –{" "}
            {formatTime(workOrder.scheduledEnd)}
          </DetailItem>
          <DetailItem label="Actual time on site">
            {workOrder.actualStart
              ? `${formatDateTime(workOrder.actualStart)} – ${
                  workOrder.actualEnd
                    ? formatTime(workOrder.actualEnd)
                    : "ongoing"
                }`
              : "Not started"}
          </DetailItem>
          <DetailItem label="Technician">
            {technician.user.name}
            <span className="block font-normal text-muted-foreground">
              {technician.employeeCode}
              {technician.user.phone ? ` · ${technician.user.phone}` : ""}
            </span>
          </DetailItem>
          <DetailItem label="Site">
            {request.site.label}
            <span className="block font-normal text-muted-foreground">
              {request.site.address}, {request.site.city}
            </span>
          </DetailItem>
        </dl>

        {(workOrder.diagnosis || workOrder.workSummary) && (
          <section className="space-y-3">
            {workOrder.diagnosis && (
              <div>
                <h3 className="text-sm font-semibold">Diagnosis</h3>
                <p className="text-sm whitespace-pre-line text-muted-foreground">
                  {workOrder.diagnosis}
                </p>
              </div>
            )}
            {workOrder.workSummary && (
              <div>
                <h3 className="text-sm font-semibold">Work summary</h3>
                <p className="text-sm whitespace-pre-line text-muted-foreground">
                  {workOrder.workSummary}
                </p>
              </div>
            )}
          </section>
        )}

        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Parts used</h3>
          <PartsList parts={workOrder.parts} />
        </section>
      </div>
    </>
  );
}
