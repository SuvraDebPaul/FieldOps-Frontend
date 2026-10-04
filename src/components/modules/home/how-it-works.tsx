import {
  ClipboardList,
  CreditCard,
  Receipt,
  UserCheck,
  Wrench,
} from "lucide-react";
import SectionHeading from "@/components/shared/section-heading";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Raise a request",
    description:
      "Choose your site and the service you need, with a preferred time.",
  },
  {
    icon: UserCheck,
    title: "Skill-matched dispatch",
    description:
      "A dispatcher assigns a qualified technician into a conflict-free slot.",
  },
  {
    icon: Wrench,
    title: "On-site work",
    description:
      "The technician travels, diagnoses, repairs and logs every part used.",
  },
  {
    icon: Receipt,
    title: "Transparent invoice",
    description:
      "Billed from actual hours worked plus parts, with VAT itemised.",
  },
  {
    icon: CreditCard,
    title: "Pay securely",
    description: "Settle online through Stripe, then rate the technician.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <SectionHeading
        eyebrow="How it works"
        title="One workflow for every job"
        description="Every step is tracked, so you always know who is coming, when, and what you'll pay."
      />
      <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className="space-y-3 rounded-xl border bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
