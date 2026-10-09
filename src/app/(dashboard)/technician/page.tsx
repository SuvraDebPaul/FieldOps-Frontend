import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeletons";
import TechnicianStats from "@/components/modules/technicians/technician-stats";
import TodaySchedule from "@/components/modules/technicians/today-schedule";
import TechnicianJobList from "@/components/modules/technicians/technician-job-list";

export const metadata: Metadata = { title: "My jobs" };

export default function TechnicianJobsPage() {
  return (
    <>
      <PageHeader
        title="My jobs"
        description="Your assigned work orders, from travel to completion."
      />
      <TechnicianStats />
      <TodaySchedule />
      <Suspense fallback={<TableSkeleton columns={6} />}>
        <TechnicianJobList />
      </Suspense>
    </>
  );
}
