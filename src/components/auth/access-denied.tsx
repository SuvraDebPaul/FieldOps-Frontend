import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccessDenied({ homeUrl }: { homeUrl: string }) {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="rounded-full bg-destructive/10 p-4">
        <ShieldAlert className="size-8 text-destructive" />
      </span>
      <div>
        <h1 className="text-lg font-semibold">
          You don&apos;t have access to this page
        </h1>
        <p className="text-sm text-muted-foreground">
          This area belongs to a different role.
        </p>
      </div>
      <Button asChild>
        <Link href={homeUrl}>Go to my dashboard</Link>
      </Button>
    </div>
  );
}
