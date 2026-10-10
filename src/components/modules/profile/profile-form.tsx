"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import TextField from "@/components/form/fields/text-field";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateProfile } from "@/hooks";
import type { UpdateProfilePayload, UserDetail } from "@/types";
import {
  customerProfileSchema,
  type ProfileFormValues,
  profileSchema,
} from "@/validation";

export default function ProfileForm({ user }: { user: UserDetail }) {
  const isCustomer = user.role === "CUSTOMER";
  const updateProfile = useUpdateProfile();

  const defaultValues: ProfileFormValues = {
    name: user.name,
    phone: user.phone ?? "",
    companyName: user.customer?.companyName ?? "",
    billingAddr: user.customer?.billingAddr ?? "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onChange: isCustomer ? customerProfileSchema : profileSchema,
    },
    onSubmit: ({ value, formApi }) => {
      const payload: UpdateProfilePayload = {
        name: value.name.trim(),
        phone: value.phone.trim() || undefined,
        ...(isCustomer
          ? {
              companyName: value.companyName.trim(),
              billingAddr: value.billingAddr.trim(),
            }
          : {}),
      };

      updateProfile.mutate(payload, {
        onSuccess: () => {
          toast.success("Profile updated");
          formApi.reset(value);
        },
      });
    },
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
          <form.Field name="name">
            {(field) => (
              <TextField field={field} label="Full name" autoComplete="name" />
            )}
          </form.Field>
          <form.Field name="phone">
            {(field) => (
              <TextField
                field={field}
                label="Phone"
                type="tel"
                autoComplete="tel"
              />
            )}
          </form.Field>
        </div>

        {isCustomer && (
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="companyName">
              {(field) => (
                <TextField
                  field={field}
                  label="Company name"
                  autoComplete="organization"
                />
              )}
            </form.Field>
            <form.Field name="billingAddr">
              {(field) => (
                <TextField
                  field={field}
                  label="Billing address"
                  autoComplete="street-address"
                />
              )}
            </form.Field>
          </div>
        )}

        <form.Subscribe selector={(state) => state.isDirty}>
          {(isDirty) => (
            <Button
              type="submit"
              className="w-fit"
              disabled={!isDirty || updateProfile.isPending}
            >
              {updateProfile.isPending && <Spinner />} Save changes
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
