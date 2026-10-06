import { apiClient } from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateRequestPayload,
  PaginatedResponse,
  RequestParams,
  ServiceRequest,
  ServiceRequestBase,
  ServiceRequestDetail,
  UpdateRequestPayload,
} from "@/types";

export function getRequests(params?: RequestParams) {
  return apiClient<PaginatedResponse<ServiceRequest>>("/requests", { params });
}

export function getRequest(requestId: string) {
  return apiClient<ApiResponse<ServiceRequestDetail>>(`/requests/${requestId}`);
}

export function createRequest(payload: CreateRequestPayload) {
  return apiClient<ApiResponse<ServiceRequestBase>>("/requests", {
    method: "POST",
    body: payload,
  });
}

export function updateRequest({
  requestId,
  ...payload
}: UpdateRequestPayload & { requestId: string }) {
  return apiClient<ApiResponse<ServiceRequestBase>>(`/requests/${requestId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function cancelRequest(requestId: string) {
  return apiClient<ApiResponse<ServiceRequestBase>>(
    `/requests/${requestId}/cancel`,
    { method: "PATCH" },
  );
}
