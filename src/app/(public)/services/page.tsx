import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getSkills } from "@/api";
import ServiceCatalog from "@/components/modules/services/service-catalog";
import ServiceGrid from "@/components/modules/services/service-grid";
import SectionHeading from "@/components/shared/section-heading";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Browse FieldOps service categories: HVAC, electrical, plumbing, generators, hydraulics and fire safety.",
};

export default async function ServicesPage() {
  const [{ data: categories }, { data: allSkills }] = await Promise.all([
    getCategories({ limit: 100 }),
    getSkills(),
  ]);

  const skills = allSkills.filter((s) => (s._count?.categories ?? 0) > 0);

  return (
    <section className="mx-auto w-full max-w-7xl space-y-10 px-4 py-12 md:py-16">
      <SectionHeading
        align="left"
        eyebrow="Service catalog"
        title="Every job type we handle"
        description="Each service is performed by a technician holding the matching skill."
      />
      <Suspense fallback={<ServiceGrid categories={categories} />}>
        <ServiceCatalog categories={categories} skills={skills} />
      </Suspense>
    </section>
  );
}
