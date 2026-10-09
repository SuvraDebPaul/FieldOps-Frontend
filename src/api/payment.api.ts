import { apiClient } from "@/lib/apiClient";
import type {
  ApiResponse,
  InitiatePaymentResponse,
  PaymentDetail,
} from "@/types";

export function initiatePayment(invoiceId: string) {
  return apiClient<ApiResponse<InitiatePaymentResponse>>("/payments/initiate", {
    method: "POST",
    body: { invoiceId },
  });
}

export function getPayment(transactionId: string) {
  return apiClient<ApiResponse<PaymentDetail>>(`/payments/${transactionId}`);
}
