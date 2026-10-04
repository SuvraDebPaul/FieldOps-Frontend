import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ServiceCategory } from "@/types";
import { formatCurrency, formatDuration } from "@/utils";

export default function ServiceCard({
  category,
}: {
  category: ServiceCategory;
}) {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <Badge variant="secondary" className="w-fit">
          {category.requiredSkill.name}
        </Badge>
        <CardTitle className="mt-2 text-lg">{category.name}</CardTitle>
        {category.description && (
          <CardDescription>{category.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between text-sm">
        <span className="font-semibold">
          {formatCurrency(category.baseCharge)}{" "}
          <span className="font-normal text-muted-foreground">base</span>
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Clock className="size-4" /> {formatDuration(category.estimatedMins)}
        </span>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/services/${category.id}`}>
            View details <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
