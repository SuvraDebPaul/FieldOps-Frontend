"use client";

import { CalendarCheck, CheckCircle2, Truck, Wrench } from "lucide-react";
import StatCard from "@/components/shared/stat-card";
import { useWorkOrderStatusCounts } from "@/hooks";
import type { WorkOrderStatus } from "@/types";

const COUNTED: WorkOrderStatus[] = [
  "SCHEDULED",
  "EN_ROUTE",
  "IN_PROGRESS",
  "COMPLETED",
];

export default function TechnicianStats() {
  const { counts, isPending } = useWorkOrderStatusCounts(COUNTED);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Scheduled"
        value={counts.SCHEDULED}
        icon={CalendarCheck}
        isLoading={isPending}
        href="/technician?status=SCHEDULED"
      />
      <StatCard
        label="En route"
        value={counts.EN_ROUTE}
        icon={Truck}
        isLoading={isPending}
        href="/technician?status=EN_ROUTE"
      />
      <StatCard
        label="In progress"
        value={counts.IN_PROGRESS}
        icon={Wrench}
        isLoading={isPending}
        href="/technician?status=IN_PROGRESS"
      />
      <StatCard
        label="Awaiting invoice"
        value={counts.COMPLETED}
        icon={CheckCircle2}
        isLoading={isPending}
        href="/technician?status=COMPLETED"
      />
    </div>
  );
}
