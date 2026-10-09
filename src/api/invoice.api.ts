import { apiClient } from "@/lib/apiClient";
import type {
  ApiResponse,
  Invoice,
  InvoiceParams,
  PaginatedResponse,
} from "@/types";

export function getInvoices(params?: InvoiceParams) {
  return apiClient<PaginatedResponse<Invoice>>("/invoices", { params });
}

export function getInvoice(invoiceId: string) {
  return apiClient<ApiResponse<Invoice>>(`/invoices/${invoiceId}`);
}
