import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ServiceCategory } from "@/types";
import { formatCurrency, formatDuration } from "@/utils";

export default function HeroSection({
  featured,
}: {
  featured: ServiceCategory[];
}) {
  return (
    <section className="relative overflow-hidden border-b bg-linear-to-b from-primary/5 to-background">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:py-24 lg:grid-cols-2">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium">
            <ShieldCheck className="size-3.5 text-primary" />
            Skill-matched technicians · Stripe-secured payments
          </span>
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Industrial maintenance,{" "}
            <span className="text-primary">from request to paid invoice.</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Raise a service request for any of your sites, get a qualified
            technician dispatched into a conflict-free slot, track the job live
            and pay a transparent invoice online.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard/requests/new">
                Request a service <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/services">Browse services</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <p className="mb-4 text-sm font-semibold">Popular services</p>
          <ul className="divide-y">
            {featured.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/services/${category.id}`}
                  className="flex items-center justify-between gap-4 py-3 transition-colors hover:text-primary"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {category.requiredSkill.name} ·{" "}
                      {formatDuration(category.estimatedMins)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold">
                    {formatCurrency(category.baseCharge)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
