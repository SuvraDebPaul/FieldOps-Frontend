import { MapPin, Star } from "lucide-react";
import UserAvatar from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicTechnician } from "@/types";
import { formatCurrency } from "@/utils";

export default function TechnicianCard({
  technician,
}: {
  technician: PublicTechnician;
}) {
  const hasReviews = technician.ratingCount > 0;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-3">
        <UserAvatar
          name={technician.user.name}
          src={technician.user.avatarUrl}
          size={48}
        />
        <div className="min-w-0">
          <CardTitle className="truncate text-base">
            {technician.user.name}
          </CardTitle>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" /> {technician.baseCity}
          </p>
        </div>
        <Badge
          variant={technician.isAvailable ? "default" : "outline"}
          className="ml-auto shrink-0"
        >
          {technician.isAvailable ? "Available" : "Unavailable"}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-1 text-sm">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="font-medium">
            {hasReviews ? Number(technician.ratingAvg).toFixed(1) : "New"}
          </span>
          {hasReviews && (
            <span className="text-muted-foreground">
              ({technician.ratingCount}{" "}
              {technician.ratingCount === 1 ? "review" : "reviews"})
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {technician.skills.map((s) => (
            <Badge key={s.skillId} variant="secondary">
              {s.skill.name}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(technician.hourlyRate)}/hr · {technician.employeeCode}
        </p>
      </CardContent>
    </Card>
  );
}
