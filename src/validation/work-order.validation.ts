import { z } from "zod";

export const completeJobSchema = z.object({
  diagnosis: z
    .string()
    .trim()
    .max(2000, "Diagnosis cannot exceed 2000 characters"),
  workSummary: z
    .string()
    .trim()
    .min(10, "Describe the work done in at least 10 characters")
    .max(2000, "Work summary cannot exceed 2000 characters"),
  note: z.string().trim().max(500, "Note cannot exceed 500 characters"),
});

export type CompleteJobValues = z.infer<typeof completeJobSchema>;

export const partSchema = z.object({
  name: z.string().trim().min(2, "Part name is required"),
  quantity: z
    .string()
    .refine(
      (v) => Number.isInteger(Number(v)) && Number(v) >= 1,
      "Quantity must be a whole number of at least 1",
    ),
  unitPrice: z
    .string()
    .refine((v) => v !== "" && Number(v) >= 0, "Unit price cannot be negative"),
});

export type PartFormValues = z.infer<typeof partSchema>;
