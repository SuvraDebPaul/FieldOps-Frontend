"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useLoginWithRedirect, useRegister } from "@/hooks";
import type { RegisterPayload } from "@/types";
import { getErrorMessage } from "@/utils";
import { type RegisterFormValues, registerSchema } from "@/validation";
import PasswordField from "./fields/password-field";
import TextField from "./fields/text-field";

const defaultValues: RegisterFormValues = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  billingAddr: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterForm() {
  const { mutate: register, isPending: isRegistering } = useRegister();
  const { login, isPending: isLoggingIn } = useLoginWithRedirect();
  const isPending = isRegistering || isLoggingIn;

  const form = useForm({
    defaultValues,
    validators: { onChange: registerSchema },
    onSubmit: ({ value }) => {
      const payload: RegisterPayload = {
        name: value.name,
        email: value.email,
        password: value.password,
        companyName: value.companyName,
        billingAddr: value.billingAddr,
        phone: value.phone || undefined,
      };

      register(payload, {
        onSuccess: () => {
          toast.success("Account created. Signing you in…");
          login({ email: value.email, password: value.password });
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      });
    },
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Register your company to request on-site service
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
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
                  <TextField
                    field={field}
                    label="Full name"
                    autoComplete="name"
                  />
                )}
              </form.Field>
              <form.Field name="phone">
                {(field) => (
                  <TextField
                    field={field}
                    label="Phone (optional)"
                    type="tel"
                    autoComplete="tel"
                  />
                )}
              </form.Field>
            </div>

            <form.Field name="email">
              {(field) => (
                <TextField
                  field={field}
                  label="Work email"
                  type="email"
                  autoComplete="email"
                />
              )}
            </form.Field>

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

            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="password">
                {(field) => (
                  <PasswordField
                    field={field}
                    label="Password"
                    autoComplete="new-password"
                  />
                )}
              </form.Field>
              <form.Field name="confirmPassword">
                {(field) => (
                  <PasswordField
                    field={field}
                    label="Confirm password"
                    autoComplete="new-password"
                  />
                )}
              </form.Field>
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner /> Creating account
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </FieldGroup>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
