import { apiClient } from "@/lib/apiClient";
import type {
  ApiResponse,
  Feedback,
  FeedbackBase,
  PaginatedResponse,
  SubmitFeedbackPayload,
  WorkOrder,
  WorkOrderDetail,
  WorkOrderParams,
} from "@/types";

export function getWorkOrders(params?: WorkOrderParams) {
  return apiClient<PaginatedResponse<WorkOrder>>("/work-orders", { params });
}

export function getWorkOrder(workOrderId: string) {
  return apiClient<ApiResponse<WorkOrderDetail>>(`/work-orders/${workOrderId}`);
}

export function getWorkOrderFeedback(workOrderId: string) {
  return apiClient<ApiResponse<Feedback>>(
    `/work-orders/${workOrderId}/feedback`,
  );
}

export function submitFeedback({
  workOrderId,
  ...payload
}: SubmitFeedbackPayload & { workOrderId: string }) {
  return apiClient<ApiResponse<FeedbackBase>>(
    `/work-orders/${workOrderId}/feedback`,
    {
      method: "POST",
      body: payload,
    },
  );
}
