import { apiClient } from "@/lib/apiClient";
import type {
  ApiResponse,
  PaginatedResponse,
  UpdateUserRolePayload,
  UpdateUserStatusPayload,
  User,
  UserParams,
  UserWithProfile,
} from "@/types";

export function getUsers(params?: UserParams) {
  return apiClient<PaginatedResponse<UserWithProfile>>("/admin/users", {
    params,
  });
}

export function updateUserStatus({
  userId,
  ...payload
}: UpdateUserStatusPayload & { userId: string }) {
  return apiClient<ApiResponse<User>>(`/admin/users/${userId}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function updateUserRole({
  userId,
  ...payload
}: UpdateUserRolePayload & { userId: string }) {
  return apiClient<ApiResponse<User>>(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: payload,
  });
}
