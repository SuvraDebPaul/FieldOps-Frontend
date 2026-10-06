import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRequest } from "@/api";
import type { RequestParams } from "@/types";

export const REQUEST_KEYS = {
  all: ["requests"] as const,
  list: (params: RequestParams) => ["requests", "list", params] as const,
  detail: (requestId: string) => ["requests", "detail", requestId] as const,
};

export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.all }),
    meta: { errorMessage: "Couldn't submit your request" },
  });
}
