import type {
  InvoiceStatus,
  PaymentStatus,
  Priority,
  RequestStatus,
  WorkOrderStatus,
} from "@/types";

export type BadgeTone =
  | "neutral"
  | "info"
  | "warning"
  | "success"
  | "danger"
  | "primary";

interface StatusMeta {
  label: string;
  tone: BadgeTone;
}

export const REQUEST_STATUS_META: Record<RequestStatus, StatusMeta> = {
  PENDING: { label: "Pending review", tone: "warning" },
  APPROVED: { label: "Approved", tone: "info" },
  REJECTED: { label: "Rejected", tone: "danger" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
  CONVERTED: { label: "Scheduled", tone: "success" }, // turned into a work order
};

export const WORK_ORDER_STATUS_META: Record<WorkOrderStatus, StatusMeta> = {
  ASSIGNED: { label: "Assigned", tone: "info" },
  SCHEDULED: { label: "Scheduled", tone: "info" },
  EN_ROUTE: { label: "En route", tone: "primary" },
  IN_PROGRESS: { label: "In progress", tone: "primary" },
  COMPLETED: { label: "Completed", tone: "success" },
  INVOICED: { label: "Invoiced", tone: "warning" },
  PAID: { label: "Paid", tone: "success" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
};

export const INVOICE_STATUS_META: Record<InvoiceStatus, StatusMeta> = {
  DUE: { label: "Due", tone: "warning" },
  PAID: { label: "Paid", tone: "success" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
};

export const PAYMENT_STATUS_META: Record<PaymentStatus, StatusMeta> = {
  INITIATED: { label: "Initiated", tone: "neutral" },
  SUCCESS: { label: "Successful", tone: "success" },
  FAILED: { label: "Failed", tone: "danger" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
};

export const PRIORITY_META: Record<Priority, StatusMeta> = {
  LOW: { label: "Low", tone: "neutral" },
  NORMAL: { label: "Normal", tone: "info" },
  HIGH: { label: "High", tone: "warning" },
  CRITICAL: { label: "Critical", tone: "danger" },
};

export const WORK_ORDER_FLOW: WorkOrderStatus[] = [
  "ASSIGNED",
  "SCHEDULED",
  "EN_ROUTE",
  "IN_PROGRESS",
  "COMPLETED",
  "INVOICED",
  "PAID",
];
