import { z } from "zod";

export const approveRequestSchema = z
  .object({
    technicianId: z.string().min(1, "Choose a technician"),
    scheduledStart: z
      .string()
      .min(1, "Choose a start time")
      .refine(
        (v) => new Date(v).getTime() > Date.now(),
        "The start time must be in the future",
      ),
    scheduledEnd: z.string().min(1, "Choose an end time"),
  })
  // Mirrors the backend's assertValidWindow ("scheduledEnd Must Be After scheduledStart")
  .refine(
    (d) =>
      !d.scheduledStart ||
      !d.scheduledEnd ||
      new Date(d.scheduledEnd) > new Date(d.scheduledStart),
    { message: "The end must be after the start", path: ["scheduledEnd"] },
  );

export type ApproveRequestValues = z.infer<typeof approveRequestSchema>;

export const rejectRequestSchema = z.object({
  rejectReason: z
    .string()
    .trim()
    .min(5, "A rejection reason of at least 5 characters is required")
    .max(500, "Keep the reason under 500 characters"),
});

export type RejectRequestValues = z.infer<typeof rejectRequestSchema>;
