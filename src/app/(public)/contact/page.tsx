import { Clock, Mail, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import ContactForm from "@/components/form/contact-form";
import SectionHeading from "@/components/shared/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FAQS, SUPPORT_EMAIL } from "@/constants/contact.constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with FieldOps about a new service, an existing job or an invoice, and read answers to common questions.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-16 px-4 py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <SectionHeading
            align="left"
            eyebrow="Contact"
            title="Talk to our team"
            description="Questions about a service, a job in progress or an invoice? Send us a message."
          />
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <Mail className="size-5 shrink-0 text-primary" />
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-medium hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="size-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">
                Already a customer? Your dashboard shows the live status of
                every request and job.
              </span>
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="size-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">
                Never send card details by email. Invoices are paid only through
                Stripe checkout.
              </span>
            </li>
          </ul>
        </div>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Send a message</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>

      <section className="space-y-8">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mx-auto max-w-3xl divide-y rounded-xl border">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {faq.question}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
