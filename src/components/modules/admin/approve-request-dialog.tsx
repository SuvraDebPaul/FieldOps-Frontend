"use client";

import { useForm } from "@tanstack/react-form";
import { addDays, addMinutes, isFuture, setHours, setMinutes } from "date-fns";
import { CheckCircle2, UserX } from "lucide-react";
import RadioCardField from "@/components/form/fields/radio-card-field";
import TextField from "@/components/form/fields/text-field";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useApproveRequest, useTechnicians, useSkills } from "@/hooks";
import type { ServiceRequestDetail } from "@/types";
import {
  formatCurrency,
  formatDuration,
  fromDateTimeLocal,
  toDateTimeLocal,
} from "@/utils";
import { type ApproveRequestValues, approveRequestSchema } from "@/validation";

function defaultStart(preferredAt: string | null) {
  if (preferredAt && isFuture(new Date(preferredAt)))
    return toDateTimeLocal(preferredAt);
  const tomorrowNine = setMinutes(setHours(addDays(new Date(), 1), 9), 0);
  return toDateTimeLocal(tomorrowNine.toISOString());
}

function plusMinutes(local: string, minutes: number) {
  return local
    ? toDateTimeLocal(addMinutes(new Date(local), minutes).toISOString())
    : "";
}

export default function ApproveRequestDialog({
  request,
}: {
  request: ServiceRequestDetail;
}) {
  const { data: skills } = useSkills();
  const requiredSkill =
    skills?.find((s) => s.id === request.category.requiredSkillId)?.name ?? "—";
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <CheckCircle2 /> Approve & assign
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Approve {request.code}</DialogTitle>
          <DialogDescription>
            Assign a technician certified in <strong>{requiredSkill}</strong>{" "}
            and book a time slot.
          </DialogDescription>
        </DialogHeader>
        <ApproveForm request={request} />
      </DialogContent>
    </Dialog>
  );
}

function ApproveForm({ request }: { request: ServiceRequestDetail }) {
  const { data: skills } = useSkills();
  const requiredSkill =
    skills?.find((s) => s.id === request.category.requiredSkillId)?.name ?? "—";

  const approve = useApproveRequest();
  const { data, isPending } = useTechnicians({
    skill: requiredSkill,
    available: "true",
    limit: 50,
  });
  const technicians = data?.data ?? [];
  const duration = request.category.estimatedMins;

  const start = defaultStart(request.preferredAt);
  const defaultValues: ApproveRequestValues = {
    technicianId: "",
    scheduledStart: start,
    scheduledEnd: plusMinutes(start, duration),
  };

  const form = useForm({
    defaultValues,
    validators: { onChange: approveRequestSchema },
    onSubmit: ({ value }) =>
      approve.mutate({
        requestId: request.id,
        technicianId: value.technicianId,
        scheduledStart: fromDateTimeLocal(value.scheduledStart) ?? "",
        scheduledEnd: fromDateTimeLocal(value.scheduledEnd) ?? "",
      }),
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        {isPending ? (
          <Skeleton className="h-40 w-full rounded-xl" />
        ) : technicians.length === 0 ? (
          <EmptyState
            icon={UserX}
            title="No available technician holds this skill"
            description="Mark a qualified technician as available, or reject the request with a reason."
          />
        ) : (
          <form.Field name="technicianId">
            {(field) => (
              <RadioCardField
                field={field}
                label="Technician"
                options={technicians.map((t) => ({
                  value: t.id,
                  title: t.user.name,
                  description: `${t.baseCity} · ${formatCurrency(t.hourlyRate)}/h · ${t.employeeCode}`,
                  meta: `${
                    t.ratingCount
                      ? `★ ${Number(t.ratingAvg).toFixed(1)} (${t.ratingCount})`
                      : "New"
                  } · up to ${t.maxDailyJobs} jobs/day`,
                }))}
              />
            )}
          </form.Field>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Field listener: changing the start moves the end, keeping the estimated duration */}
          <form.Field
            name="scheduledStart"
            listeners={{
              onChange: ({ value }) =>
                form.setFieldValue(
                  "scheduledEnd",
                  plusMinutes(value, duration),
                ),
            }}
          >
            {(field) => (
              <TextField field={field} label="Start" type="datetime-local" />
            )}
          </form.Field>
          <form.Field name="scheduledEnd">
            {(field) => (
              <TextField
                field={field}
                label="End"
                type="datetime-local"
                description={`Estimated duration: ${formatDuration(duration)}`}
              />
            )}
          </form.Field>
        </div>

        <p className="text-xs text-muted-foreground">
          Double-bookings and each technician&apos;s daily limit are enforced by
          the server. If this slot isn&apos;t possible, you&apos;ll see exactly
          why.
        </p>

        <DialogFooter>
          <Button
            type="submit"
            disabled={approve.isPending || technicians.length === 0}
          >
            {approve.isPending && <Spinner />} Approve & create work order
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
