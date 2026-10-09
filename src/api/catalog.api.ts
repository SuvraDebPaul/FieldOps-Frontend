import { apiClient } from "@/lib/apiClient";
import type {
  ApiResponse,
  CategoryParams,
  PaginatedResponse,
  ServiceCategory,
  Skill,
  CreateCategoryPayload,
  CreateSkillPayload,
  ServiceCategoryBase,
  UpdateCategoryPayload,
} from "@/types";

export function getCategories(params?: CategoryParams) {
  return apiClient<PaginatedResponse<ServiceCategory>>("/categories", {
    params,
  });
}

export function getCategory(categoryId: string) {
  return apiClient<ApiResponse<ServiceCategory>>(`/categories/${categoryId}`);
}

export function getSkills() {
  return apiClient<ApiResponse<Skill[]>>("/skills");
}

export function createCategory(payload: CreateCategoryPayload) {
  return apiClient<ApiResponse<ServiceCategory>>("/categories", {
    method: "POST",
    body: payload,
  });
}

export function updateCategory({
  categoryId,
  ...payload
}: UpdateCategoryPayload & { categoryId: string }) {
  return apiClient<ApiResponse<ServiceCategory>>(`/categories/${categoryId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteCategory(categoryId: string) {
  return apiClient<ApiResponse<ServiceCategoryBase>>(
    `/categories/${categoryId}`,
    {
      method: "DELETE",
    },
  );
}

export function createSkill(payload: CreateSkillPayload) {
  return apiClient<ApiResponse<Skill>>("/skills", {
    method: "POST",
    body: payload,
  });
}
