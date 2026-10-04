import { apiClient } from "@/lib/apiClient";
import type {
  PaginatedResponse,
  PublicTechnician,
  TechnicianParams,
} from "@/types";

export function getTechnicians(params?: TechnicianParams) {
  return apiClient<PaginatedResponse<PublicTechnician>>("/technicians", {
    params,
  });
}
