import { Wrench } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="FieldOps home"
      className={cn(
        "flex items-center gap-2 font-heading text-lg font-semibold",
        className,
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wrench className="size-4" />
      </span>
      {/* Hidden when the dashboard sidebar collapses to icons */}
      <span className="group-data-[collapsible=icon]:hidden">
        Field<span className="text-primary">Ops</span>
      </span>
    </Link>
  );
}
