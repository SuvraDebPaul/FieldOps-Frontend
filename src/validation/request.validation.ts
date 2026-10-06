import { z } from "zod";
import { PRIORITIES } from "@/types";

export const siteStepSchema = z.object({
  siteId: z.string().min(1, "Choose the site where the work is needed"),
});

export const serviceStepSchema = z.object({
  categoryId: z.string().min(1, "Choose the service you need"),
});

export const detailsStepSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters long")
    .max(150, "Title cannot exceed 150 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters long")
    .max(2000, "Description cannot exceed 2000 characters"),
  priority: z.enum(PRIORITIES),
  preferredAt: z
    .string()
    .refine(
      (value) => value === "" || new Date(value).getTime() > Date.now(),
      "Choose a time in the future",
    ),
});

// The whole draft, checked once more on the Review step before submitting
export const createRequestSchema = z.object({
  ...siteStepSchema.shape,
  ...serviceStepSchema.shape,
  ...detailsStepSchema.shape,
});

export type DetailsStepValues = z.infer<typeof detailsStepSchema>;
