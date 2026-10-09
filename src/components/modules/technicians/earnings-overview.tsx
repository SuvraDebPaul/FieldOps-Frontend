"use client";

import { DollarSign, Receipt, Star, Wallet } from "lucide-react";
import EmptyState from "@/components/shared/empty-state";
import MonthlyBarChart from "@/components/shared/charts/monthly-bar-chart";
import RatingStars from "@/components/shared/rating-stars";
import StatCard from "@/components/shared/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeedbacks, useGetMe, useInvoices } from "@/hooks";
import { formatCurrency, formatDate, groupByMonth } from "@/utils";

export default function EarningsOverview() {
  const { data: me } = useGetMe();
  const invoices = useInvoices({ limit: 100 }); // the backend returns only this technician's invoices
  const feedbacks = useFeedbacks({ limit: 20 }); // …and only the ratings they received

  const rows = invoices.data?.data ?? [];
  const totalBilled = rows.reduce(
    (sum, inv) => sum + Number(inv.labourAmount),
    0,
  );
  const paidLabour = rows
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + Number(inv.labourAmount), 0);
  const monthly = groupByMonth(
    rows,
    (inv) => inv.issuedAt,
    (inv) => Number(inv.labourAmount),
  );

  const technician = me?.data.technician;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Labour billed"
          value={formatCurrency(totalBilled)}
          icon={DollarSign}
          isLoading={invoices.isPending}
        />
        <StatCard
          label="Labour paid"
          value={formatCurrency(paidLabour)}
          icon={Wallet}
          isLoading={invoices.isPending}
        />
        <StatCard
          label="Invoiced jobs"
          value={invoices.data?.meta.total ?? 0}
          icon={Receipt}
          isLoading={invoices.isPending}
        />
        <StatCard
          label="Average rating"
          value={
            technician?.ratingCount
              ? Number(technician.ratingAvg).toFixed(1)
              : "–"
          }
          hint={`${technician?.ratingCount ?? 0} review(s)`}
          icon={Star}
          isLoading={!technician}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Labour billed per month</CardTitle>
          <CardDescription>Last 6 months, by invoice date.</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <MonthlyBarChart
              data={monthly}
              valueLabel="Labour billed"
              formatValue={formatCurrency}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer reviews</CardTitle>
          <CardDescription>
            Left by customers after paying for a job.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedbacks.isPending ? (
            <Skeleton className="h-32 w-full" />
          ) : feedbacks.data && feedbacks.data.data.length > 0 ? (
            <ul className="divide-y">
              {feedbacks.data.data.map((fb) => (
                <li key={fb.id} className="space-y-1 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <RatingStars rating={fb.rating} />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(fb.createdAt)}
                    </span>
                  </div>
                  {fb.comment && <p className="text-sm">{fb.comment}</p>}
                  <p className="text-xs text-muted-foreground">
                    {fb.workOrder.request.customer.companyName} ·{" "}
                    {fb.workOrder.request.category.name} · {fb.workOrder.code}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Star}
              title="No reviews yet"
              description="Customers can rate a job once it's paid."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
