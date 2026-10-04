import type { Metadata } from "next";
import RegisterForm from "@/components/form/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a FieldOps customer account for your company.",
};

export default function RegisterPage() {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <RegisterForm />
      </div>
    </section>
  );
}
