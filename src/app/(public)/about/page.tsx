import {
  Building2,
  CalendarCheck,
  CreditCard,
  FileClock,
  type LucideIcon,
  Receipt,
  ShieldCheck,
  UserCheck,
  UserCog,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import CtaSection from "@/components/modules/home/cta-section";
import SectionHeading from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why FieldOps exists and the guarantees behind every job: skill-matched dispatch, no double-booking, honest billing and secure payments.",
};

const GUARANTEES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: CalendarCheck,
    title: "No double-booking",
    description:
      "A technician can never hold two overlapping jobs. The database itself rejects conflicting time slots.",
  },
  {
    icon: UserCheck,
    title: "Skill-matched dispatch",
    description:
      "A job is only assigned to a technician who holds the skill the service requires and is under their daily limit.",
  },
  {
    icon: Receipt,
    title: "Billing from actual hours",
    description:
      "Invoices use the real on-site start and end time, the parts logged on the job and itemised VAT.",
  },
  {
    icon: CreditCard,
    title: "Payments confirmed by Stripe",
    description:
      "An invoice is only marked paid after Stripe's signed confirmation, never from the browser.",
  },
  {
    icon: ShieldCheck,
    title: "Instant access control",
    description:
      "Suspending an account or changing a role takes effect on the very next request.",
  },
  {
    icon: FileClock,
    title: "Full job history",
    description:
      "Every status change is recorded with who made it and when, from assignment to payment.",
  },
];

const ROLES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Building2,
    title: "Customers",
    description:
      "Register sites, raise requests, follow each job live, pay invoices online and rate the work.",
  },
  {
    icon: UserCog,
    title: "Dispatchers",
    description:
      "Review requests, assign technicians to conflict-free slots, generate invoices and manage the catalog.",
  },
  {
    icon: Wrench,
    title: "Technicians",
    description:
      "See only their assigned jobs, move them through each stage on site and log the parts they use.",
  },
];

function FeatureGrid({
  items,
  columns,
}: {
  items: typeof GUARANTEES;
  columns: string;
}) {
  return (
    <div className={`grid gap-6 ${columns}`}>
      {items.map(({ icon: Icon, title, description }) => (
        <div key={title} className="space-y-3 rounded-xl border bg-card p-6">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="border-b bg-linear-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-center md:py-24">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            About FieldOps
          </p>
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Field service without the phone tag.
          </h1>
          <p className="text-lg text-muted-foreground">
            Industrial sites lose hours chasing who is coming, when, and what it
            will cost. FieldOps puts the whole job, from the first request to
            the paid invoice, in one place that customers, dispatchers and
            technicians all share.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-16 md:py-24">
        <SectionHeading
          eyebrow="Our guarantees"
          title="Rules the platform enforces for you"
          description="These aren't promises in a brochure. They're checks built into every request."
        />
        <FeatureGrid
          items={GUARANTEES}
          columns="sm:grid-cols-2 lg:grid-cols-3"
        />
      </section>

      <section className="bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-7xl space-y-10 px-4">
          <SectionHeading
            eyebrow="Who it's for"
            title="One platform, three workspaces"
            description="Each role sees exactly what it needs, and nothing it shouldn't."
          />
          <FeatureGrid items={ROLES} columns="md:grid-cols-3" />
        </div>
      </section>

      <div className="pt-16 md:pt-24">
        <CtaSection />
      </div>
    </>
  );
}
