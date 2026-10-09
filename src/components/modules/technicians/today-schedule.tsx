"use client";

import { endOfDay, startOfDay } from "date-fns";
import { CalendarClock, MapPin } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import StatusBadge from "@/components/shared/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WORK_ORDER_STATUS_META } from "@/constants/status.constants";
import { useWorkOrders } from "@/hooks";
import { formatTime } from "@/utils";

export default function TodaySchedule() {
  const now = new Date();
  // startOfDay/endOfDay give the SAME strings all day → a stable query key
  const { data, isPending } = useWorkOrders({
    from: startOfDay(now).toISOString(),
    to: endOfDay(now).toISOString(),
    sortBy: "scheduledStart",
    sortOrder: "asc",
    limit: 20,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s schedule</CardTitle>
        <CardDescription>Jobs starting today, in order.</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-24 w-full" />
        ) : data && data.data.length > 0 ? (
          <ol className="divide-y">
            {data.data.map((wo) => (
              <li key={wo.id}>
                <Link
                  href={`/technician?view=${wo.id}`}
                  className="flex items-center gap-4 py-3 transition-colors hover:text-primary"
                >
                  <span className="w-20 shrink-0 font-mono text-sm font-semibold">
                    {formatTime(wo.scheduledStart)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{wo.request.title}</p>
                    <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <MapPin className="size-3" /> {wo.request.site.label},{" "}
                      {wo.request.site.city}
                    </p>
                  </div>
                  <StatusBadge {...WORK_ORDER_STATUS_META[wo.status]} />
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState icon={CalendarClock} title="Nothing scheduled today" />
        )}
      </CardContent>
    </Card>
  );
}
