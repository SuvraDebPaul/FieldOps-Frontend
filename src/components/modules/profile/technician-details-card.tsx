import DetailItem from "@/components/shared/detail-item";
import RatingStars from "@/components/shared/rating-stars";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TechnicianProfile, TechnicianSkill } from "@/types";
import { formatCurrency } from "@/utils";

type Props = { technician: TechnicianProfile & { skills: TechnicianSkill[] } };

export default function TechnicianDetailsCard({ technician }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Work profile</CardTitle>
        <CardDescription>
          Managed by your dispatcher. Contact them to change these details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <dl className="grid gap-4 sm:grid-cols-3">
          <DetailItem label="Employee code">
            {technician.employeeCode}
          </DetailItem>
          <DetailItem label="Base city">{technician.baseCity}</DetailItem>
          <DetailItem label="Hourly rate">
            {formatCurrency(technician.hourlyRate)}
          </DetailItem>
          <DetailItem label="Daily job limit">
            {technician.maxDailyJobs} jobs
          </DetailItem>
          <DetailItem label="Availability">
            <Badge variant={technician.isAvailable ? "default" : "outline"}>
              {technician.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </DetailItem>
          <DetailItem label="Customer rating">
            <span className="flex items-center gap-2">
              <RatingStars rating={Number(technician.ratingAvg)} />
              <span className="text-xs font-normal text-muted-foreground">
                ({technician.ratingCount})
              </span>
            </span>
          </DetailItem>
        </dl>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Certified skills</p>
          <div className="flex flex-wrap gap-2">
            {technician.skills.map((s) => (
              <Badge key={s.skillId} variant="secondary">
                {s.skill.name} · L{s.level}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
