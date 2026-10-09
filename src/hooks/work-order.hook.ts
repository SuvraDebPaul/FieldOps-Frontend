import {
  keepPreviousData,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { FetchError } from "ofetch";
import { toast } from "sonner";
import {
  getWorkOrder,
  getWorkOrderFeedback,
  getWorkOrders,
  submitFeedback,
} from "@/api";
import type { WorkOrderParams } from "@/types";

export const WORK_ORDER_KEYS = {
  all: ["work-orders"] as const,
  lists: ["work-orders", "list"] as const,
  list: (params: WorkOrderParams) => ["work-orders", "list", params] as const,
  detail: (id: string) => ["work-orders", "detail", id] as const,
  feedback: (id: string) => ["work-orders", "feedback", id] as const,
};

export function useWorkOrders(params: WorkOrderParams) {
  return useQuery({
    queryKey: WORK_ORDER_KEYS.list(params),
    queryFn: () => getWorkOrders(params),
    placeholderData: keepPreviousData,
    meta: { errorMessage: "Couldn't load work orders" },
  });
}

export function useWorkOrder(workOrderId: string | null) {
  return useQuery({
    queryKey: WORK_ORDER_KEYS.detail(workOrderId ?? ""),
    queryFn: workOrderId ? () => getWorkOrder(workOrderId) : skipToken,
    select: (res) => res.data,
    meta: { errorMessage: "Couldn't load this work order" },
  });
}

/** null = no feedback yet. The backend answers 404 for that, which is NOT an error for us. */
export function useWorkOrderFeedback(workOrderId: string | null) {
  return useQuery({
    queryKey: WORK_ORDER_KEYS.feedback(workOrderId ?? ""),
    queryFn: workOrderId
      ? async () => {
          try {
            const { data } = await getWorkOrderFeedback(workOrderId);
            return data;
          } catch (error) {
            if (error instanceof FetchError && error.status === 404)
              return null;
            throw error;
          }
        }
      : skipToken,
  });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitFeedback,
    onSuccess: (_res, { workOrderId }) => {
      // In the hook: the form unmounts as soon as the feedback appears (same lesson as cancel)
      toast.success("Thanks for rating this job!");
      return queryClient.invalidateQueries({
        queryKey: WORK_ORDER_KEYS.feedback(workOrderId),
      });
    },
    meta: { errorMessage: "Couldn't submit your rating" },
  });
}
