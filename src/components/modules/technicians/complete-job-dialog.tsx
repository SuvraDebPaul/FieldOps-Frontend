"use client";

import { useForm } from "@tanstack/react-form";
import { CheckCircle2 } from "lucide-react";
import TextareaField from "@/components/form/fields/textarea-field";
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
import { useChangeWorkOrderStatus } from "@/hooks";
import type { WorkOrderDetail } from "@/types";
import { type CompleteJobValues, completeJobSchema } from "@/validation";

export default function CompleteJobDialog({
  workOrder,
}: {
  workOrder: WorkOrderDetail;
}) {
  const changeStatus = useChangeWorkOrderStatus();

  const defaultValues: CompleteJobValues = {
    diagnosis: workOrder.diagnosis ?? "",
    workSummary: workOrder.workSummary ?? "",
    note: "",
  };

  const form = useForm({
    defaultValues,
    validators: { onChange: completeJobSchema },
    onSubmit: ({ value }) =>
      changeStatus.mutate({
        workOrderId: workOrder.id,
        status: "COMPLETED",
        diagnosis: value.diagnosis.trim() || undefined,
        workSummary: value.workSummary.trim(),
        note: value.note.trim() || undefined,
      }),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <CheckCircle2 /> Complete job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Complete {workOrder.code}</DialogTitle>
          <DialogDescription>
            This stops the billable clock. The dispatcher then issues the
            invoice from your actual time on site and the parts you logged.
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="diagnosis">
              {(field) => (
                <TextareaField
                  field={field}
                  label="Diagnosis (optional)"
                  rows={3}
                  maxLength={2000}
                />
              )}
            </form.Field>
            <form.Field name="workSummary">
              {(field) => (
                <TextareaField
                  field={field}
                  label="Work carried out"
                  rows={4}
                  maxLength={2000}
                />
              )}
            </form.Field>
            <form.Field name="note">
              {(field) => (
                <TextField
                  field={field}
                  label="Note for the history (optional)"
                  maxLength={500}
                />
              )}
            </form.Field>
            <DialogFooter>
              <Button type="submit" disabled={changeStatus.isPending}>
                {changeStatus.isPending && <Spinner />} Mark as completed
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
