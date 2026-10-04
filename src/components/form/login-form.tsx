"use client";

import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "@/constants/auth.constants";
import { useLoginWithRedirect } from "@/hooks";
import { LoginFormValues, loginSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FieldGroup, FieldSeparator } from "../ui/field";
import TextField from "./fields/text-field";
import PasswordField from "./fields/password-field";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import DemoLogin from "./demo-login";
import Link from "next/link";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const { login, isPending, pendingEmail } = useLoginWithRedirect(
    searchParams.get("redirect"),
  );
  const isDemoPending = DEMO_ACCOUNTS.some((a) => a.email === pendingEmail);
  const form = useForm({
    defaultValues: { email: "", password: "" } as LoginFormValues,
    validators: { onChange: loginSchema },
    onSubmit: ({ value }) => login(value),
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Log in to your FieldOps account</CardDescription>
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
            <form.Field name="email">
              {(field) => (
                <TextField
                  field={field}
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <PasswordField
                  field={field}
                  label="Password"
                  autoComplete="current-password"
                />
              )}
            </form.Field>

            <Button type="submit" disabled={isPending}>
              {isPending && !isDemoPending ? (
                <>
                  <Spinner /> Logging in
                </>
              ) : (
                "Log in"
              )}
            </Button>
          </FieldGroup>
        </form>
        <FieldSeparator> Or Try a Demo Account</FieldSeparator>

        <DemoLogin
          onSelect={(email) => login({ email, password: DEMO_PASSWORD })}
          pendingEmail={pendingEmail}
          disabled={isPending}
        />

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Register as a customer
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
