"use client";

import { useForm } from "@tanstack/react-form";
import PasswordField from "@/components/form/fields/password-field";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useChangePassword } from "@/hooks";
import {
  type ChangePasswordFormValues,
  changePasswordSchema,
} from "@/validation";

const defaultValues: ChangePasswordFormValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePasswordForm() {
  const changePassword = useChangePassword();

  const form = useForm({
    defaultValues,
    validators: { onChange: changePasswordSchema },
    onSubmit: ({ value }) =>
      changePassword.mutate({
        oldPassword: value.oldPassword,
        newPassword: value.newPassword,
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
        <form.Field name="oldPassword">
          {(field) => (
            <PasswordField
              field={field}
              label="Current password"
              autoComplete="current-password"
            />
          )}
        </form.Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="newPassword">
            {(field) => (
              <PasswordField
                field={field}
                label="New password"
                autoComplete="new-password"
              />
            )}
          </form.Field>
          <form.Field name="confirmPassword">
            {(field) => (
              <PasswordField
                field={field}
                label="Confirm new password"
                autoComplete="new-password"
              />
            )}
          </form.Field>
        </div>
        <p className="text-xs text-muted-foreground">
          At least 8 characters, one uppercase letter and one number.
          You&apos;ll be signed out of every device.
        </p>
        <Button
          type="submit"
          variant="outline"
          className="w-fit"
          disabled={changePassword.isPending || changePassword.isSuccess}
        >
          {changePassword.isPending && <Spinner />} Update password
        </Button>
      </FieldGroup>
    </form>
  );
}
