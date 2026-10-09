import { apiClient } from "@/lib/apiClient";
import type { Feedback, FeedbackParams, PaginatedResponse } from "@/types";

export function getFeedbacks(params?: FeedbackParams) {
  return apiClient<PaginatedResponse<Feedback>>("/feedbacks", { params });
}
