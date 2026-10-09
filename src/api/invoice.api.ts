import { apiClient } from "@/lib/apiClient";
import type {
  ApiResponse,
  Invoice,
  InvoiceBase,
  InvoiceParams,
  PaginatedResponse,
} from "@/types";

export function getInvoices(params?: InvoiceParams) {
  return apiClient<PaginatedResponse<Invoice>>("/invoices", { params });
}

export function getInvoice(invoiceId: string) {
  return apiClient<ApiResponse<Invoice>>(`/invoices/${invoiceId}`);
}

export function generateInvoice(workOrderId: string) {
  return apiClient<ApiResponse<InvoiceBase>>(
    `/work-orders/${workOrderId}/invoice`,
    {
      method: "POST",
    },
  );
}
