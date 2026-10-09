import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFeedbacks } from "@/api";
import type { FeedbackParams } from "@/types";

export function useFeedbacks(params: FeedbackParams) {
  return useQuery({
    queryKey: ["feedbacks", params],
    queryFn: () => getFeedbacks(params),
    placeholderData: keepPreviousData,
    meta: { errorMessage: "Couldn't load reviews" },
  });
}
