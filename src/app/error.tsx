"use client";

import RouteError, {
  type RouteErrorProps,
} from "@/components/shared/route-error";

export default function RootError(props: RouteErrorProps) {
  return (
    <main className="flex min-h-svh flex-col">
      <RouteError {...props} />
    </main>
  );
}
