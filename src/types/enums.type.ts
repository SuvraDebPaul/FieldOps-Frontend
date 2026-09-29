export const ROLES = ["CUSTOMER", "TECHNICIAN", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const USER_STATUSES = ["ACTIVE", "SUSPENDED"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export type AuthProvider = "CREDENTIALS" | "GOOGLE";

export const PRIORITIES = ["LOW", "NORMAL", "HIGH", "CRITICAL"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const REQUEST_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "CONVERTED",
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const WORK_ORDER_STATUSES = [
  "ASSIGNED",
  "SCHEDULED",
  "EN_ROUTE",
  "IN_PROGRESS",
  "COMPLETED",
  "INVOICED",
  "PAID",
  "CANCELLED",
] as const;
export type WorkOrderStatus = (typeof WORK_ORDER_STATUSES)[number];

export const INVOICE_STATUSES = ["DUE", "PAID", "CANCELLED"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export type PaymentStatus = "INITIATED" | "SUCCESS" | "FAILED" | "CANCELLED";
