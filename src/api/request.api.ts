import { apiClient } from "@/lib/apiClient";
import type {
  ApiResponse,
  ApproveRequestPayload,
  CreateRequestPayload,
  PaginatedResponse,
  RejectRequestPayload,
  RequestParams,
  ServiceRequest,
  ServiceRequestBase,
  ServiceRequestDetail,
  UpdateRequestPayload,
  WorkOrderBase,
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

export function approveRequest({
  requestId,
  ...payload
}: ApproveRequestPayload & { requestId: string }) {
  return apiClient<ApiResponse<WorkOrderBase>>(
    `/requests/${requestId}/approve`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export function rejectRequest({
  requestId,
  ...payload
}: RejectRequestPayload & { requestId: string }) {
  return apiClient<ApiResponse<ServiceRequestBase>>(
    `/requests/${requestId}/reject`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export function deleteRequest(requestId: string) {
  return apiClient<ApiResponse<ServiceRequestBase>>(`/requests/${requestId}`, {
    method: "DELETE",
  });
}
