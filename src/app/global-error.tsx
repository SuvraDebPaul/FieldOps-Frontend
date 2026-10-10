"use client";

import "./globals.css";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-svh items-center justify-center bg-background p-6 font-sans text-foreground antialiased">
        <title>Something went wrong | FieldOps</title>
        <main role="alert" className="max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-semibold">
            FieldOps couldn&apos;t load
          </h1>
          <p className="text-muted-foreground">
            A critical error stopped the app from starting. Please try again in
            a moment.
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-muted-foreground">
              Reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={() => retry()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
