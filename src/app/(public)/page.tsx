import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getSkills, getTechnicians } from "@/api";
import CtaSection from "@/components/modules/home/cta-section";
import HeroSection from "@/components/modules/home/hero-section";
import HowItWorks from "@/components/modules/home/how-it-works";
import ServiceGrid from "@/components/modules/services/service-grid";
import TechnicianCard from "@/components/modules/technicians/technician-card";
import SectionHeading from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "FieldOps: Field Service Management" },
  description:
    "Book skill-matched technicians for on-site industrial maintenance, track every job and pay online.",
};

export default async function HomePage() {
  const [categories, technicians, skills] = await Promise.all([
    getCategories({ limit: 6 }),
    getTechnicians({ limit: 3 }),
    getSkills(),
  ]);

  const stats = [
    { label: "Service categories", value: categories.meta.total },
    { label: "Field technicians", value: technicians.meta.total },
    { label: "Trade skills covered", value: skills.data.length },
  ];

  return (
    <>
      <HeroSection featured={categories.data.slice(0, 4)} />

      <section className="border-b">
        <dl className="mx-auto grid max-w-7xl grid-cols-1 divide-y px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-8 text-center">
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="font-heading text-3xl font-bold text-primary">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <HowItWorks />

      <section className="bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-7xl space-y-10 px-4">
          <SectionHeading
            eyebrow="Service catalog"
            title="What we service"
            description="Fixed scope, indicative base charges and estimated durations for every job type."
          />
          <ServiceGrid categories={categories.data} />
          <div className="text-center">
            <Button asChild variant="outline">
              <Link href="/services">
                View all services <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-16 md:py-24">
        <SectionHeading
          eyebrow="Our team"
          title="Top-rated technicians"
          description="Ratings come from verified customers after every paid job."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {technicians.data.map((technician) => (
            <TechnicianCard key={technician.id} technician={technician} />
          ))}
        </div>
      </section>

      <CtaSection />
    </>
  );
}
