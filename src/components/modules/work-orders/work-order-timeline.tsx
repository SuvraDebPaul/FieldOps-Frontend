import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import {
  WORK_ORDER_FLOW,
  WORK_ORDER_STATUS_META,
} from "@/constants/status.constants";
import { cn } from "@/lib/utils";
import type { WorkOrderDetail, WorkOrderStatus } from "@/types";
import { formatDateTime } from "@/utils";

type TimelineProps = {
  workOrder: Pick<WorkOrderDetail, "status" | "history" | "cancelReason">;
};

export default function WorkOrderTimeline({ workOrder }: TimelineProps) {
  const reachedAt = new Map<WorkOrderStatus, string>();
  for (const entry of workOrder.history) {
    if (!reachedAt.has(entry.toStatus))
      reachedAt.set(entry.toStatus, entry.createdAt);
  }

  return (
    <div className="space-y-4">
      {workOrder.status === "CANCELLED" && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <p className="font-medium text-destructive">This job was cancelled</p>
          {workOrder.cancelReason && (
            <p className="text-muted-foreground">{workOrder.cancelReason}</p>
          )}
        </div>
      )}

      <ol>
        {WORK_ORDER_FLOW.map((status, index) => {
          const at = reachedAt.get(status);
          const isCurrent = status === workOrder.status;
          const isDone = Boolean(at) && !isCurrent;
          const isLast = index === WORK_ORDER_FLOW.length - 1;
          const Icon = isCurrent ? CircleDot : isDone ? CheckCircle2 : Circle;

          return (
            <li key={status} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-6 left-2.5 h-[calc(100%-1.5rem)] w-px",
                    isDone ? "bg-primary" : "bg-border",
                  )}
                />
              )}
              <Icon
                className={cn(
                  "relative size-5 shrink-0",
                  isCurrent || isDone
                    ? "text-primary"
                    : "text-muted-foreground/40",
                )}
              />
              <div className="-mt-0.5">
                <p
                  className={cn(
                    "text-sm font-medium",
                    !at && "text-muted-foreground",
                  )}
                >
                  {WORK_ORDER_STATUS_META[status].label}
                  {isCurrent && (
                    <span className="ml-2 text-xs font-normal text-primary">
                      Current
                    </span>
                  )}
                </p>
                {at && (
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(at)}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
