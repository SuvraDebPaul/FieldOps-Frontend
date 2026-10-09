"use client";

import { useForm } from "@tanstack/react-form";
import { PackagePlus } from "lucide-react";
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
import { useAddPartUsage } from "@/hooks";
import { formatCurrency } from "@/utils";
import { type PartFormValues, partSchema } from "@/validation";

export default function LogPartDialog({
  workOrderId,
}: {
  workOrderId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PackagePlus /> Log part used
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log a part</DialogTitle>
          <DialogDescription>
            It is added to the customer&apos;s invoice at this price.
          </DialogDescription>
        </DialogHeader>
        <PartForm workOrderId={workOrderId} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function PartForm({
  workOrderId,
  onDone,
}: {
  workOrderId: string;
  onDone: () => void;
}) {
  const addPart = useAddPartUsage();
  const defaultValues: PartFormValues = {
    name: "",
    quantity: "1",
    unitPrice: "",
  };

  const form = useForm({
    defaultValues,
    validators: { onChange: partSchema },
    onSubmit: ({ value }) =>
      addPart.mutate(
        {
          workOrderId,
          name: value.name.trim(),
          quantity: Number(value.quantity),
          unitPrice: Number(value.unitPrice),
        },
        {
          onSuccess: () => {
            toast.success(`${value.name} logged`);
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
        <form.Field name="name">
          {(field) => (
            <TextField
              field={field}
              label="Part name"
              placeholder="e.g. Pressure relief valve"
            />
          )}
        </form.Field>
        <div className="grid grid-cols-2 gap-4">
          <form.Field name="quantity">
            {(field) => (
              <TextField
                field={field}
                label="Quantity"
                type="number"
                min={1}
                step={1}
              />
            )}
          </form.Field>
          <form.Field name="unitPrice">
            {(field) => (
              <TextField
                field={field}
                label="Unit price (USD)"
                type="number"
                min={0}
                step="0.01"
              />
            )}
          </form.Field>
        </div>

        {/* Only this line re-renders as you type quantity or price */}
        <form.Subscribe
          selector={(s) =>
            Number(s.values.quantity) * Number(s.values.unitPrice)
          }
        >
          {(lineTotal) => (
            <p className="text-sm text-muted-foreground">
              Line total:{" "}
              <span className="font-semibold text-foreground">
                {formatCurrency(Number.isFinite(lineTotal) ? lineTotal : 0)}
              </span>
            </p>
          )}
        </form.Subscribe>

        <DialogFooter>
          <Button type="submit" disabled={addPart.isPending}>
            {addPart.isPending && <Spinner />} Add part
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
