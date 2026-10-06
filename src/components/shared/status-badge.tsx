import { Badge } from "@/components/ui/badge";
import type { BadgeTone } from "@/constants/status.constants";
import { cn } from "@/lib/utils";

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  danger: "bg-red-500/10 text-red-700 dark:text-red-300",
  primary: "bg-primary/10 text-primary",
};

export default function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: BadgeTone;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent font-medium", TONE_CLASSES[tone])}
    >
      {label}
    </Badge>
  );
}
