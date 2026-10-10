"use client";

import { useForm } from "@tanstack/react-form";
import { differenceInMinutes } from "date-fns";
import { CalendarClock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import TextField from "@/components/form/fields/text-field";
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
import { Spinner } from "@/components/ui/spinner";
import { useRescheduleWorkOrder } from "@/hooks";
import type { WorkOrderDetail } from "@/types";
import {
  addMinutesToLocal,
  formatDuration,
  fromDateTimeLocal,
  toDateTimeLocal,
} from "@/utils";
import { type RescheduleValues, rescheduleSchema } from "@/validation";

export default function RescheduleDialog({
  workOrder,
}: {
  workOrder: WorkOrderDetail;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarClock /> Reschedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Reschedule {workOrder.code}</DialogTitle>
          <DialogDescription>
            {workOrder.technician.user.name} keeps the job. Overlaps are
            rejected by the server.
          </DialogDescription>
        </DialogHeader>
        <RescheduleForm workOrder={workOrder} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function RescheduleForm({
  workOrder,
  onDone,
}: {
  workOrder: WorkOrderDetail;
  onDone: () => void;
}) {
  const reschedule = useRescheduleWorkOrder();
  const duration = differenceInMinutes(
    new Date(workOrder.scheduledEnd),
    new Date(workOrder.scheduledStart),
  );

  const defaultValues: RescheduleValues = {
    scheduledStart: toDateTimeLocal(workOrder.scheduledStart),
    scheduledEnd: toDateTimeLocal(workOrder.scheduledEnd),
    note: "",
  };

  const form = useForm({
    defaultValues,
    validators: { onChange: rescheduleSchema },
    onSubmit: ({ value }) =>
      reschedule.mutate(
        {
          workOrderId: workOrder.id,
          scheduledStart: fromDateTimeLocal(value.scheduledStart) ?? "",
          scheduledEnd: fromDateTimeLocal(value.scheduledEnd) ?? "",
          note: value.note.trim() || undefined,
        },
        {
          onSuccess: () => {
            toast.success(`${workOrder.code} rescheduled`);
            onDone();
          },
        },
      ),
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
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field
            name="scheduledStart"
            listeners={{
              onChange: ({ value }) =>
                form.setFieldValue(
                  "scheduledEnd",
                  addMinutesToLocal(value, duration),
                ),
            }}
          >
            {(field) => (
              <TextField
                field={field}
                label="New start"
                type="datetime-local"
              />
            )}
          </form.Field>
          <form.Field name="scheduledEnd">
            {(field) => (
              <TextField
                field={field}
                label="New end"
                type="datetime-local"
                description={`Current length: ${formatDuration(duration)}`}
              />
            )}
          </form.Field>
        </div>
        <form.Field name="note">
          {(field) => (
            <TextField
              field={field}
              label="Reason (optional)"
              placeholder="e.g. Customer site closed on Friday"
            />
          )}
        </form.Field>
        <DialogFooter>
          <Button type="submit" disabled={reschedule.isPending}>
            {reschedule.isPending && <Spinner />} Save new time
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
