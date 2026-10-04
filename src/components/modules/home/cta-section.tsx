import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 md:pb-24">
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-primary px-8 py-10 text-primary-foreground md:flex-row md:items-center">
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            Ready to book your next service?
          </h2>
          <p className="text-primary-foreground/80">
            Register your company in a minute and raise your first request
            today.
          </p>
        </div>
        <Button asChild size="lg" variant="secondary">
          <Link href="/register">Create a free account</Link>
        </Button>
      </div>
    </section>
  );
}
