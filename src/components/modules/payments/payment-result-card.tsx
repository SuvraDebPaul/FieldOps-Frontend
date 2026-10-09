import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  success: "bg-emerald-500/10 text-emerald-600",
  danger: "bg-red-500/10 text-red-600",
  warning: "bg-amber-500/10 text-amber-600",
  info: "bg-primary/10 text-primary",
};

interface PaymentResultCardProps {
  icon: LucideIcon;
  tone: keyof typeof TONE_CLASSES;
  title: string;
  description: string;
  spinning?: boolean;
  children?: ReactNode;
  actions?: ReactNode;
}

export default function PaymentResultCard({
  icon: Icon,
  tone,
  title,
  description,
  spinning,
  children,
  actions,
}: PaymentResultCardProps) {
  return (
    <Card className="w-full max-w-md text-center" aria-live="polite">
      <CardHeader>
        <span
          className={cn(
            "mx-auto flex size-14 items-center justify-center rounded-full",
            TONE_CLASSES[tone],
          )}
        >
          <Icon className={cn("size-7", spinning && "animate-spin")} />
        </span>
        <CardTitle className="mt-4 text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
      {actions && (
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          {actions}
        </CardFooter>
      )}
    </Card>
  );
}
