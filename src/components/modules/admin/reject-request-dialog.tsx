"use client";

import { useForm } from "@tanstack/react-form";
import { XCircle } from "lucide-react";
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
import { useRejectRequest } from "@/hooks";
import type { ServiceRequestDetail } from "@/types";
import { type RejectRequestValues, rejectRequestSchema } from "@/validation";

export default function RejectRequestDialog({
  request,
}: {
  request: ServiceRequestDetail;
}) {
  const reject = useRejectRequest();
  const defaultValues: RejectRequestValues = { rejectReason: "" };

  const form = useForm({
    defaultValues,
    validators: { onChange: rejectRequestSchema },
    onSubmit: ({ value }) =>
      reject.mutate({
        requestId: request.id,
        rejectReason: value.rejectReason.trim(),
      }),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive"
        >
          <XCircle /> Reject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject {request.code}</DialogTitle>
          <DialogDescription>
            The customer sees this reason on their request.
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
            <form.Field name="rejectReason">
              {(field) => (
                <TextareaField
                  field={field}
                  label="Reason"
                  rows={4}
                  maxLength={500}
                />
              )}
            </form.Field>
            <DialogFooter>
              <Button
                type="submit"
                variant="destructive"
                disabled={reject.isPending}
              >
                {reject.isPending && <Spinner />} Reject request
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
