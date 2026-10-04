import { ArrowLeft, CheckCircle2, Clock, Wallet, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FetchError } from "ofetch";
import { cache } from "react";
import { getCategories, getCategory, getTechnicians } from "@/api";
import TechnicianCard from "@/components/modules/technicians/technician-card";
import EmptyState from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDuration } from "@/utils";

export const revalidate = 3600;

// 1. Pre-build one page per category at build time
export async function generateStaticParams() {
  const { data } = await getCategories({ limit: 100 });
  return data.map((category) => ({ id: category.id }));
}

// 2. Fetch once per request: React's cache() lets generateMetadata and the page share one call
const loadCategory = cache(async (id: string) => {
  try {
    const { data } = await getCategory(id);
    return data;
  } catch (error) {
    if (error instanceof FetchError && error.status === 404) return null;
    throw error; // any other failure → error.tsx
  }
});

// 3. Per-page SEO
export async function generateMetadata({
  params,
}: PageProps<"/services/[id]">): Promise<Metadata> {
  const { id } = await params;
  const category = await loadCategory(id);
  if (!category) return { title: "Service not found" };

  const description =
    category.description ??
    `${category.name}, performed by certified ${category.requiredSkill.name} technicians.`;

  return {
    title: category.name,
    description,
    openGraph: { title: category.name, description },
  };
}

const BILLING_FACTS = [
  "Labour billed from the technician's actual on-site time (minimum 0.5 h)",
  "Parts used are itemised at their logged unit price",
  "15% VAT applied to labour and parts",
  "Invoice due within 7 days, payable online by card",
];

export default async function ServiceDetailPage({
  params,
}: PageProps<"/services/[id]">) {
  const { id } = await params;
  const category = await loadCategory(id);
  if (!category) notFound();

  const { data: technicians } = await getTechnicians({
    skill: category.requiredSkill.name,
    limit: 6,
  });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-12 px-4 py-10 md:py-14">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/services">
          <ArrowLeft /> All services
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{category.requiredSkill.name}</Badge>
            {!category.isActive && (
              <Badge variant="outline">Currently unavailable</Badge>
            )}
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-muted-foreground">
              {category.description}
            </p>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                How you&apos;re billed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {BILLING_FACTS.map((fact) => (
                  <li
                    key={fact}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    {fact}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-3">
              <Wallet className="size-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Base charge</p>
                <p className="font-semibold">
                  {formatCurrency(category.baseCharge)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="size-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Estimated duration
                </p>
                <p className="font-semibold">
                  {formatDuration(category.estimatedMins)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wrench className="size-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Required skill</p>
                <p className="font-semibold">{category.requiredSkill.name}</p>
              </div>
            </div>
            <Button asChild className="w-full" disabled={!category.isActive}>
              <Link href={`/dashboard/requests/new?categoryId=${category.id}`}>
                Request this service
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-semibold">
          Technicians qualified for this job
        </h2>
        {technicians.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {technicians.map((technician) => (
              <TechnicianCard key={technician.id} technician={technician} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Wrench}
            title="No technicians listed yet"
            description="Requests are still accepted. A dispatcher will assign the next qualified technician."
          />
        )}
      </section>
    </div>
  );
}
