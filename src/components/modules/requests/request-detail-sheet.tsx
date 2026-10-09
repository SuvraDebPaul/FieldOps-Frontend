"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import DetailItem from "@/components/shared/detail-item";
import StatusBadge from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PRIORITY_META,
  REQUEST_STATUS_META,
  WORK_ORDER_STATUS_META,
} from "@/constants/status.constants";
import { useQueryParams, useRequest } from "@/hooks";
import type { ServiceRequestDetail } from "@/types";
import { formatDateTime, formatTime } from "@/utils";

interface RequestDetailSheetProps {
  renderActions?: (request: ServiceRequestDetail) => ReactNode;
}

export default function RequestDetailSheet({
  renderActions,
}: RequestDetailSheetProps) {
  const { get, setParams } = useQueryParams();
  const requestId = get("view") || null;
  const { data: request, isError } = useRequest(requestId);

  return (
    <Sheet
      open={Boolean(requestId)}
      onOpenChange={(open) => {
        if (!open) setParams({ view: null });
      }}
    >
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {request ? (
          <RequestDetails
            request={request}
            actions={renderActions?.(request)}
          />
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>Request details</SheetTitle>
              <SheetDescription>
                {isError ? "This request couldn't be loaded." : "Loading…"}
              </SheetDescription>
            </SheetHeader>
            {!isError && (
              <div className="space-y-3 px-4">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function RequestDetails({
  request,
  actions,
}: {
  request: ServiceRequestDetail;
  actions: ReactNode;
}) {
  const { site, category, workOrder, customer } = request;
  const pathname = usePathname();
  const workOrdersPath = pathname.startsWith("/admin")
    ? "/admin/work-orders"
    : "/dashboard/work-orders";

  return (
    <>
      <SheetHeader>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {request.code}
          </span>
          <StatusBadge {...REQUEST_STATUS_META[request.status]} />
          <StatusBadge {...PRIORITY_META[request.priority]} />
        </div>
        <SheetTitle className="text-xl">{request.title}</SheetTitle>
        <SheetDescription>
          Submitted {formatDateTime(request.createdAt)}
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 px-4 pb-4">
        {request.status === "REJECTED" && request.rejectReason && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
            <p className="font-medium text-destructive">
              Rejected by the dispatcher
            </p>
            <p className="text-muted-foreground">{request.rejectReason}</p>
          </div>
        )}

        {workOrder && (
          <section className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">
                Work order {workOrder.code}
              </p>
              <StatusBadge {...WORK_ORDER_STATUS_META[workOrder.status]} />
            </div>
            <p className="text-sm text-muted-foreground">
              {workOrder.technician.user.name} ·{" "}
              {formatDateTime(workOrder.scheduledStart)} –{" "}
              {formatTime(workOrder.scheduledEnd)}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href={`${workOrdersPath}?view=${workOrder.id}`}>
                Track this job
              </Link>
            </Button>
          </section>
        )}

        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailItem label="Customer">
            {customer.companyName}
            <span className="block font-normal text-muted-foreground">
              {customer.user.name} · {customer.user.email}
            </span>
          </DetailItem>

          <DetailItem label="Service">{category.name}</DetailItem>

          <DetailItem label="Required skill">
            {category.requiredSkill.name}
          </DetailItem>

          <DetailItem label="Site">
            {site.label}
            <span className="block font-normal text-muted-foreground">
              {site.address}, {site.city}
            </span>
          </DetailItem>

          <DetailItem label="On-site contact">
            {site.contactName}
            <span className="block font-normal text-muted-foreground">
              {site.contactPhone}
            </span>
          </DetailItem>

          <DetailItem label="Preferred time">
            {request.preferredAt
              ? formatDateTime(request.preferredAt)
              : "Flexible"}
          </DetailItem>

          <DetailItem label="Last updated">
            {formatDateTime(request.updatedAt)}
          </DetailItem>
        </dl>

        <section className="space-y-1">
          <h3 className="text-sm font-semibold">Description</h3>
          <p className="text-sm whitespace-pre-line text-muted-foreground">
            {request.description}
          </p>
        </section>
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2 border-t px-4 py-3">
          {actions}
        </div>
      )}
    </>
  );
}
