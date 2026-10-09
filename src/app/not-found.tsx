import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <p className="font-heading text-7xl font-bold text-primary">404</p>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">
          We couldn&apos;t find that page
        </h1>
        <p className="max-w-md text-muted-foreground">
          The link may be broken, or the page may have moved.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/services">Browse services</Link>
        </Button>
      </div>
    </main>
  );
}
