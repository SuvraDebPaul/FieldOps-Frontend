import { apiClient } from "@/lib/apiClient";
import type {
  ApiResponse,
  CategoryParams,
  PaginatedResponse,
  ServiceCategory,
  Skill,
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
