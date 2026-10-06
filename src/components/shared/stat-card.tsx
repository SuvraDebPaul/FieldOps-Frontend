import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
  href?: string;
  isLoading?: boolean;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  href,
  isLoading,
}: StatCardProps) {
  const card = (
    <Card className="h-full transition-colors hover:border-primary/40">
      <CardContent className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="font-heading text-3xl font-bold">{value}</p>
          )}
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );

  if (!href) return card;

  return (
    <Link
      href={href}
      className="block rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {card}
    </Link>
  );
}
