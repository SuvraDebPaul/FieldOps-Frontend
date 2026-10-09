import { z } from "zod";

// Inputs give strings, so validate the text and convert to numbers on submit (as in partSchema)
export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Category name must be at least 3 characters long")
    .max(150, "Category name cannot exceed 150 characters"),
  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters"),
  requiredSkillId: z.string().min(1, "Choose the required skill"),
  baseCharge: z
    .string()
    .refine(
      (v) => v !== "" && Number(v) >= 0,
      "Base charge cannot be negative",
    ),
  estimatedMins: z
    .string()
    .refine(
      (v) => Number.isInteger(Number(v)) && Number(v) >= 1,
      "Estimated minutes must be a whole number of at least 1",
    ),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const skillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Skill name must be at least 2 characters")
    .max(100, "Skill name is too long"),
});
