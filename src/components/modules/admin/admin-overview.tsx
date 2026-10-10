"use client";

import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import HorizontalBarChart from "@/components/shared/charts/horizontal-bar-chart";
import MonthlyBarChart from "@/components/shared/charts/monthly-bar-chart";
import EmptyState from "@/components/shared/empty-state";
import StatCard from "@/components/shared/stat-card";
import StatusBadge from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PRIORITY_META,
  WORK_ORDER_STATUS_META,
} from "@/constants/status.constants";
import { useInvoices, useRequests, useWorkOrderStatusCounts } from "@/hooks";
import { WORK_ORDER_STATUSES, type WorkOrderStatus } from "@/types";
import { formatCurrency, formatDate, groupByMonth } from "@/utils";

const ACTIVE_STATUSES: WorkOrderStatus[] = [
  "ASSIGNED",
  "SCHEDULED",
  "EN_ROUTE",
  "IN_PROGRESS",
];

export default function AdminOverview() {
  const pending = useRequests({
    status: "PENDING",
    limit: 5,
    sortOrder: "asc",
  });
  const workOrders = useWorkOrderStatusCounts(WORK_ORDER_STATUSES);
  const paid = useInvoices({ status: "PAID", limit: 100 });

  const paidInvoices = paid.data?.data ?? [];
  const revenue = paidInvoices.reduce(
    (sum, inv) => sum + Number(inv.totalAmount),
    0,
  );
  const monthlyRevenue = groupByMonth(
    paidInvoices,
    (inv) => inv.paidAt ?? inv.issuedAt,
    (inv) => Number(inv.totalAmount),
  );
  const activeJobs = ACTIVE_STATUSES.reduce(
    (sum, s) => sum + workOrders.counts[s],
    0,
  );
  const byStatus = WORK_ORDER_STATUSES.map((s) => ({
    label: WORK_ORDER_STATUS_META[s].label,
    value: workOrders.counts[s],
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pending requests"
          value={pending.data?.meta.total ?? 0}
          hint="Waiting for review"
          icon={ClipboardList}
          isLoading={pending.isPending}
          href="/admin/requests?status=PENDING"
        />
        <StatCard
          label="Active jobs"
          value={activeJobs}
          hint="Assigned → in progress"
          icon={Wrench}
          isLoading={workOrders.isPending}
          href="/admin/work-orders"
        />
        <StatCard
          label="Awaiting invoice"
          value={workOrders.counts.COMPLETED}
          icon={CheckCircle2}
          isLoading={workOrders.isPending}
          href="/admin/work-orders?status=COMPLETED"
        />
        <StatCard
          label="Revenue collected"
          value={formatCurrency(revenue)}
          hint={`${paid.data?.meta.total ?? 0} paid invoice(s)`}
          icon={DollarSign}
          isLoading={paid.isPending}
          href="/admin/invoices?status=PAID"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue collected</CardTitle>
            <CardDescription>
              Paid invoices per month, last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {paid.isPending ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <MonthlyBarChart
                data={monthlyRevenue}
                valueLabel="Revenue"
                formatValue={formatCurrency}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Work orders by status</CardTitle>
            <CardDescription>
              Every job in the system right now.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workOrders.isPending ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <HorizontalBarChart data={byStatus} valueLabel="Work orders" />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Waiting longest</CardTitle>
            <CardDescription>Pending requests, oldest first.</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/requests?status=PENDING">
              Review all <ArrowRight />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {pending.isPending ? (
            <Skeleton className="h-40 w-full" />
          ) : pending.data && pending.data.data.length > 0 ? (
            <ul className="divide-y">
              {pending.data.data.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/admin/requests?view=${r.id}`}
                    className="flex items-center justify-between gap-4 py-3 transition-colors hover:text-primary"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{r.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.code} · {r.customer.companyName} · {r.category.name}{" "}
                        · {formatDate(r.createdAt)}
                      </p>
                    </div>
                    <StatusBadge {...PRIORITY_META[r.priority]} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={CheckCircle2}
              title="Inbox zero"
              description="No requests are waiting for review."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
