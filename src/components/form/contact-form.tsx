"use client";

import { useForm } from "@tanstack/react-form";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { CONTACT_TOPICS, SUPPORT_EMAIL } from "@/constants/contact.constants";
import { type ContactFormValues, contactSchema } from "@/validation";
import SelectField from "./fields/select-field";
import TextareaField from "./fields/textarea-field";
import TextField from "./fields/text-field";

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  company: "",
  topic: "",
  message: "",
};

export default function ContactForm() {
  const form = useForm({
    defaultValues,
    validators: { onChange: contactSchema },
    onSubmit: ({ value, formApi }) => {
      const body = [
        value.message,
        "",
        "—",
        `Name: ${value.name}`,
        `Email: ${value.email}`,
        value.company && `Company: ${value.company}`,
      ]
        .filter(Boolean)
        .join("\n");

      const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
        `[FieldOps] ${value.topic}`,
      )}&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;
      toast.success("Opening your email app…", {
        description: "Just press send. We'll reply to the address you entered.",
      });
      formApi.reset();
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
              <TextField field={field} label="Your name" autoComplete="name" />
            )}
          </form.Field>
          <form.Field name="email">
            {(field) => (
              <TextField
                field={field}
                label="Email"
                type="email"
                autoComplete="email"
              />
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="company">
            {(field) => (
              <TextField
                field={field}
                label="Company (optional)"
                autoComplete="organization"
              />
            )}
          </form.Field>
          <form.Field name="topic">
            {(field) => (
              <SelectField
                field={field}
                label="Topic"
                options={CONTACT_TOPICS}
                placeholder="What is this about?"
              />
            )}
          </form.Field>
        </div>

        <form.Field name="message">
          {(field) => (
            <TextareaField
              field={field}
              label="Message"
              rows={6}
              maxLength={1000}
              placeholder="Tell us about your site, equipment and what you need."
            />
          )}
        </form.Field>

        <Button type="submit" className="w-fit">
          <Send /> Send message
        </Button>
      </FieldGroup>
    </form>
  );
}
