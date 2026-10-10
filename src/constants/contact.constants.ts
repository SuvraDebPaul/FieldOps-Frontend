export const SUPPORT_EMAIL = "info@fieldops.com";

export const CONTACT_TOPICS = [
  { value: "New service enquiry", label: "New service enquiry" },
  { value: "Help with an existing job", label: "Help with an existing job" },
  { value: "Invoices and payments", label: "Invoices and payments" },
  { value: "Join as a technician", label: "Join as a technician" },
];

export const FAQS = [
  {
    question: "How do I request a service?",
    answer:
      "Register your company, add the site where the work is needed, then create a request by choosing the site and the service. A dispatcher reviews it and assigns a qualified technician.",
  },
  {
    question: "Can I edit or cancel a request?",
    answer:
      "Yes, while it is still Pending. Once a dispatcher approves it, it becomes a scheduled work order and can only be changed by the dispatcher.",
  },
  {
    question: "How is my invoice calculated?",
    answer:
      "Labour is billed from the technician's actual on-site time at their hourly rate (minimum half an hour), plus the parts used, plus 15% VAT. Invoices are due within 7 days.",
  },
  {
    question: "How do I pay?",
    answer:
      "Online by card through Stripe's secure checkout. Your invoice and work order update automatically as soon as Stripe confirms the payment.",
  },
  {
    question: "Can I choose my technician?",
    answer:
      "The dispatcher assigns the technician, choosing someone who holds the required skill, is available, has no overlapping job and is under their daily limit.",
  },
  {
    question: "Can I rate the work?",
    answer:
      "Yes. Once the invoice is paid you can give the job a 1–5 star rating with a comment, which updates the technician's public rating.",
  },
];
