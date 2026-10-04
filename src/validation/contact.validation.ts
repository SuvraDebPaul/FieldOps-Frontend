import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.email("Enter a valid email address"),
  company: z.string().trim(),
  topic: z.string().min(1, "Choose a topic"),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters")
    .max(1000, "Please keep it under 1000 characters"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
