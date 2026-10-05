import { apiClient } from "@/lib/apiClient";
import type {
  ApiResponse,
  PaginatedResponse,
  Site,
  SiteParams,
  SitePayload,
  UpdateSitePayload,
} from "@/types";

export function getSites(params?: SiteParams) {
  return apiClient<PaginatedResponse<Site>>("/sites", { params });
}

export function createSite(payload: SitePayload) {
  return apiClient<ApiResponse<Site>>("/sites", {
    method: "POST",
    body: payload,
  });
}

// Mutations receive ONE argument, so the id travels inside the object
export function updateSite({
  siteId,
  ...payload
}: UpdateSitePayload & { siteId: string }) {
  return apiClient<ApiResponse<Site>>(`/sites/${siteId}`, {
    method: "PATCH",
    body: payload,
  });
}
