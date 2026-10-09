import { z } from "zod";
import { passwordRule } from "./auth.validation";

const phoneRule = z
  .string()
  .trim()
  .refine((v) => v === "" || v.length >= 6, "Enter a valid phone number");

// Same SHAPE for every role (so one form type works), different RULES per role
export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: phoneRule,
  companyName: z.string().trim(),
  billingAddr: z.string().trim(),
});

export const customerProfileSchema = profileSchema.extend({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters"),
  billingAddr: z
    .string()
    .trim()
    .min(5, "Billing address must be at least 5 characters"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Enter your current password"),
    newPassword: passwordRule,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((d) => d.newPassword !== d.oldPassword, {
    message: "Choose a password different from your current one",
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
