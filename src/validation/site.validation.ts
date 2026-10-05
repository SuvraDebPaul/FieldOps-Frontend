import { z } from "zod";

export const siteSchema = z.object({
  label: z
    .string()
    .trim()
    .min(3, "Label must be at least 3 characters long")
    .max(120, "Label cannot exceed 120 characters"),
  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters long"),
  city: z.string().trim().min(2, "City is required"),
  contactName: z.string().trim().min(2, "Contact name is required"),
  contactPhone: z.string().trim().min(6, "A valid contact phone is required"),
});

export type SiteFormValues = z.infer<typeof siteSchema>;
