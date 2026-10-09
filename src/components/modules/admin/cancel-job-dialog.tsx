"use client";

import { useForm } from "@tanstack/react-form";
import { Ban } from "lucide-react";
import TextareaField from "@/components/form/fields/textarea-field";
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
import { type CancelJobValues, cancelJobSchema } from "@/validation";

export default function CancelJobDialog({
  workOrder,
}: {
  workOrder: WorkOrderDetail;
}) {
  const changeStatus = useChangeWorkOrderStatus();
  const defaultValues: CancelJobValues = { cancelReason: "" };

  const form = useForm({
    defaultValues,
    validators: { onChange: cancelJobSchema },
    // Optimistic: the status flips to CANCELLED and this dialog unmounts; the hook toasts
    onSubmit: ({ value }) =>
      changeStatus.mutate({
        workOrderId: workOrder.id,
        status: "CANCELLED",
        cancelReason: value.cancelReason.trim(),
      }),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive"
        >
          <Ban /> Cancel job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel {workOrder.code}?</DialogTitle>
          <DialogDescription>
            The technician&apos;s slot is freed and the customer sees this
            reason. This can&apos;t be undone.
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
            <form.Field name="cancelReason">
              {(field) => (
                <TextareaField
                  field={field}
                  label="Reason"
                  rows={3}
                  maxLength={500}
                />
              )}
            </form.Field>
            <DialogFooter>
              <Button
                type="submit"
                variant="destructive"
                disabled={changeStatus.isPending}
              >
                {changeStatus.isPending && <Spinner />} Cancel job
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
