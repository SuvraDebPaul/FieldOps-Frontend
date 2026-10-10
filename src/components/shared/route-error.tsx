"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export interface RouteErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function RouteError({
  error,
  retry,
  homeHref = "/",
}: RouteErrorProps & { homeHref?: string }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex min-h-[60svh] flex-1 flex-col items-center justify-center gap-6 px-4 text-center"
    >
      <span className="rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="size-8 text-destructive" />
      </span>
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold">
          Something went wrong
        </h1>
        <p className="max-w-md text-muted-foreground">
          This page hit an unexpected error. Nothing you saved was lost. Try
          again, or go back.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground">
            Reference: {error.digest}
          </p>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={() => retry()}>
          <RotateCcw /> Try again
        </Button>
        <Button asChild variant="outline">
          <Link href={homeHref}>Go back</Link>
        </Button>
      </div>
    </div>
  );
}
