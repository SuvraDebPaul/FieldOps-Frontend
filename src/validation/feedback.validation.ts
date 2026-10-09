import { z } from "zod";

export const feedbackSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Choose a rating from 1 to 5 stars")
    .max(5, "Choose a rating from 1 to 5 stars"),
  comment: z.string().trim().max(1000, "Comment cannot exceed 1000 characters"),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
