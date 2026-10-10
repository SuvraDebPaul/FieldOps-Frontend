"use client";

import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  Hourglass,
  Plus,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import PageHeader from "@/components/shared/page-header";
import StatCard from "@/components/shared/stat-card";
import StatusBadge from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { REQUEST_STATUS_META } from "@/constants/status.constants";
import { useGetMe, useRequestStatusCounts, useRequests } from "@/hooks";
import type { RequestStatus } from "@/types";
import { formatDate } from "@/utils";

const COUNTED_STATUSES: RequestStatus[] = ["PENDING", "CONVERTED", "REJECTED"];

export default function CustomerOverview() {
  const { data: me } = useGetMe();
  const { counts, isPending: countsPending } =
    useRequestStatusCounts(COUNTED_STATUSES);
  const { data: recent, isPending: recentPending } = useRequests({ limit: 5 });

  const firstName = me?.data.name.split(" ")[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        description={me?.data.customer?.companyName}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/dashboard/sites">Manage sites</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/requests/new">
                <Plus /> New request
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total requests"
          value={recent?.meta.total ?? 0}
          icon={ClipboardList}
          isLoading={recentPending}
          href="/dashboard/requests"
        />
        <StatCard
          label="Awaiting review"
          value={counts.PENDING}
          icon={Hourglass}
          hint="Editable until approved"
          isLoading={countsPending}
          href="/dashboard/requests?status=PENDING"
        />
        <StatCard
          label="Scheduled as jobs"
          value={counts.CONVERTED}
          icon={CalendarCheck}
          isLoading={countsPending}
          href="/dashboard/requests?status=CONVERTED"
        />
        <StatCard
          label="Rejected"
          value={counts.REJECTED}
          icon={XCircle}
          isLoading={countsPending}
          href="/dashboard/requests?status=REJECTED"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent requests</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/requests">
              View all <ArrowRight />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentPending ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-12 w-full" />
              ))}
            </div>
          ) : recent && recent.data.length > 0 ? (
            <ul className="divide-y">
              {recent.data.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/dashboard/requests?view=${r.id}`}
                    className="flex items-center justify-between gap-4 py-3 transition-colors hover:text-primary"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{r.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.code} · {r.site.label} · {formatDate(r.createdAt)}
                      </p>
                    </div>
                    <StatusBadge {...REQUEST_STATUS_META[r.status]} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="No requests yet"
              description="Raise your first service request in four quick steps."
              action={
                <Button asChild>
                  <Link href="/dashboard/requests/new">New request</Link>
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
