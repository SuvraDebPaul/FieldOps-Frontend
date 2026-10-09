"use client";

import { MessageSquareText, Star, ThumbsUp } from "lucide-react";
import HorizontalBarChart from "@/components/shared/charts/horizontal-bar-chart";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilterSelect from "@/components/shared/filter-select";
import RatingStars from "@/components/shared/rating-stars";
import { TableSkeleton } from "@/components/shared/skeletons";
import StatCard from "@/components/shared/stat-card";
import TablePagination from "@/components/shared/table-pagination";
import UserAvatar from "@/components/shared/user-avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeedbacks, useQueryParams, useTechnicians } from "@/hooks";
import type { Feedback } from "@/types";
import { formatCurrency, formatDate } from "@/utils";

const RATINGS = [5, 4, 3, 2, 1];
const RATING_OPTIONS = RATINGS.map((n) => ({
  value: String(n),
  label: `${n} star${n > 1 ? "s" : ""}`,
}));

const columns: DataTableColumn<Feedback>[] = [
  {
    id: "rating",
    header: "Rating",
    cell: (f) => <RatingStars rating={f.rating} />,
  },
  {
    id: "comment",
    header: "Comment",
    cell: (f) => (
      <p className="max-w-sm truncate">
        {f.comment ?? <span className="text-muted-foreground">—</span>}
      </p>
    ),
  },
  {
    id: "technician",
    header: "Technician",
    cell: (f) => f.workOrder.technician.user.name,
  },
  {
    id: "customer",
    header: "Customer",
    cell: (f) => f.workOrder.request.customer.companyName,
  },
  {
    id: "job",
    header: "Job",
    cell: (f) => (
      <span className="font-mono text-xs text-muted-foreground">
        {f.workOrder.code}
      </span>
    ),
  },
  {
    id: "date",
    header: "Date",
    cell: (f) => (
      <span className="text-muted-foreground">{formatDate(f.createdAt)}</span>
    ),
  },
];

export default function ReportsOverview() {
  const { get, setParams } = useQueryParams();
  const rating = Number(get("rating"));
  const page = Math.max(Number(get("page")) || 1, 1);

  const all = useFeedbacks({ limit: 100 }); // for the distribution and averages
  const list = useFeedbacks({
    page,
    limit: 10,
    rating: RATINGS.includes(rating) ? rating : undefined,
  });
  const leaders = useTechnicians({ limit: 5 }); // the backend sorts by rating, highest first

  const reviews = all.data?.data ?? [];
  const average = reviews.length
    ? reviews.reduce((s, f) => s + f.rating, 0) / reviews.length
    : 0;
  const fiveStarShare = reviews.length
    ? Math.round(
        (reviews.filter((f) => f.rating === 5).length / reviews.length) * 100,
      )
    : 0;
  const distribution = RATINGS.map((n) => ({
    label: `${n} star${n > 1 ? "s" : ""}`,
    value: reviews.filter((f) => f.rating === n).length,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Reviews"
          value={all.data?.meta.total ?? 0}
          icon={MessageSquareText}
          isLoading={all.isPending}
        />
        <StatCard
          label="Average rating"
          value={reviews.length ? average.toFixed(2) : "–"}
          icon={Star}
          isLoading={all.isPending}
        />
        <StatCard
          label="5-star share"
          value={`${fiveStarShare}%`}
          icon={ThumbsUp}
          isLoading={all.isPending}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rating distribution</CardTitle>
            <CardDescription>
              How customers rated completed, paid jobs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {all.isPending ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <HorizontalBarChart data={distribution} valueLabel="Reviews" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top technicians</CardTitle>
            <CardDescription>By average customer rating.</CardDescription>
          </CardHeader>
          <CardContent>
            {leaders.isPending ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ol className="divide-y">
                {(leaders.data?.data ?? []).map((t, index) => (
                  <li key={t.id} className="flex items-center gap-3 py-3">
                    <span className="w-5 text-sm font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                    <UserAvatar
                      name={t.user.name}
                      src={t.user.avatarUrl}
                      size={32}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{t.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.baseCity} · {formatCurrency(t.hourlyRate)}/h
                      </p>
                    </div>
                    <div className="text-right">
                      <RatingStars rating={Number(t.ratingAvg)} />
                      <p className="text-xs text-muted-foreground">
                        {t.ratingCount} review(s)
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>All feedback</CardTitle>
            <CardDescription>Every rating left by customers.</CardDescription>
          </div>
          <FilterSelect
            label="Filter by rating"
            allLabel="All ratings"
            value={get("rating")}
            options={RATING_OPTIONS}
            onValueChange={(value) => setParams({ rating: value, page: null })}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {list.isPending ? (
            <TableSkeleton columns={6} />
          ) : list.data && list.data.data.length > 0 ? (
            <>
              <DataTable
                columns={columns}
                rows={list.data.data}
                getRowKey={(f) => f.id}
                isUpdating={list.isPlaceholderData}
              />
              <TablePagination
                page={list.data.meta.page}
                totalPages={list.data.meta.totalPages}
                onPageChange={(next) =>
                  setParams({ page: next === 1 ? null : next })
                }
              />
            </>
          ) : (
            <EmptyState
              icon={Star}
              title="No feedback yet"
              description="Customers can rate a job once it's paid."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
