import type { Metadata } from "next";
import { Suspense } from "react";
import TechnicianDirectory from "@/components/modules/technicians/technician-directory";
import SectionHeading from "@/components/shared/section-heading";
import { CardGridSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Technicians",
  description:
    "Meet FieldOps field technicians: skills, base city, hourly rate and verified customer ratings.",
};

export default function TechniciansPage() {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-10 px-4 py-12 md:py-16">
      <SectionHeading
        align="left"
        eyebrow="Our team"
        title="Field technicians"
        description="Every technician is matched to jobs by skill, availability and daily workload."
      />
      <Suspense fallback={<CardGridSkeleton count={9} />}>
        <TechnicianDirectory />
      </Suspense>
    </section>
  );
}
