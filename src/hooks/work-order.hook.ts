import {
  keepPreviousData,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import { FetchError } from "ofetch";
import { toast } from "sonner";
import {
  getWorkOrder,
  getWorkOrderFeedback,
  getWorkOrders,
  submitFeedback,
  addPartUsage,
  changeWorkOrderStatus,
  generateInvoice,
  rescheduleWorkOrder,
} from "@/api";
import type {
  WorkOrderParams,
  ApiResponse,
  PaginatedResponse,
  WorkOrder,
  WorkOrderDetail,
  WorkOrderStatus,
} from "@/types";
import { WORK_ORDER_STATUS_META } from "@/constants/status.constants";
import { INVOICE_KEYS } from "./invoice.hook";
import { formatCurrency, formatDate } from "@/utils/format.utils";

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
      toast.success("Thanks for rating this job!");
      return queryClient.invalidateQueries({
        queryKey: WORK_ORDER_KEYS.feedback(workOrderId),
      });
    },
    meta: { errorMessage: "Couldn't submit your rating" },
  });
}

export function useWorkOrderStatusCounts(statuses: readonly WorkOrderStatus[]) {
  return useQueries({
    queries: statuses.map((status) => ({
      queryKey: WORK_ORDER_KEYS.list({ status, limit: 1 }),
      queryFn: () => getWorkOrders({ status, limit: 1 }),
      select: (res: PaginatedResponse<WorkOrder>) => res.meta.total,
    })),
    combine: (results) => ({
      counts: Object.fromEntries(
        statuses.map((status, i) => [status, results[i].data ?? 0]),
      ) as Record<WorkOrderStatus, number>,
      isPending: results.some((r) => r.isPending),
    }),
  });
}

export function useChangeWorkOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeWorkOrderStatus,

    onMutate: async ({ workOrderId, status }) => {
      await queryClient.cancelQueries({ queryKey: WORK_ORDER_KEYS.all });

      const previousDetail = queryClient.getQueryData<
        ApiResponse<WorkOrderDetail>
      >(WORK_ORDER_KEYS.detail(workOrderId));
      const previousLists = queryClient.getQueriesData<
        PaginatedResponse<WorkOrder>
      >({
        queryKey: WORK_ORDER_KEYS.lists,
      });

      queryClient.setQueryData<ApiResponse<WorkOrderDetail>>(
        WORK_ORDER_KEYS.detail(workOrderId),
        (old) => old && { ...old, data: { ...old.data, status } },
      );
      queryClient.setQueriesData<PaginatedResponse<WorkOrder>>(
        { queryKey: WORK_ORDER_KEYS.lists },
        (old) =>
          old && {
            ...old,
            data: old.data.map((wo) =>
              wo.id === workOrderId ? { ...wo, status } : wo,
            ),
          },
      );

      return { previousDetail, previousLists };
    },

    onError: (_error, { workOrderId }, snapshot) => {
      if (snapshot?.previousDetail) {
        queryClient.setQueryData(
          WORK_ORDER_KEYS.detail(workOrderId),
          snapshot.previousDetail,
        );
      }
      for (const [key, data] of snapshot?.previousLists ?? []) {
        queryClient.setQueryData(key, data);
      }
    },

    onSuccess: (_res, { status }) =>
      toast.success(`Job marked "${WORK_ORDER_STATUS_META[status].label}"`),

    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: WORK_ORDER_KEYS.all }),

    meta: { errorMessage: "Couldn't update the job status" },
  });
}

export function useAddPartUsage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPartUsage,
    onSuccess: (_res, { workOrderId }) =>
      queryClient.invalidateQueries({
        queryKey: WORK_ORDER_KEYS.detail(workOrderId),
      }),
    meta: { errorMessage: "Couldn't log the part" },
  });
}

export function useRescheduleWorkOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rescheduleWorkOrder,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: WORK_ORDER_KEYS.all }),
    meta: { errorMessage: "Couldn't reschedule the job" },
  });
}

export function useGenerateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateInvoice,
    onSuccess: ({ data }) => {
      toast.success(`Invoice ${data.invoiceNo} issued`, {
        description: `${formatCurrency(data.totalAmount)} due ${formatDate(data.dueDate)}`,
      });
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: WORK_ORDER_KEYS.all }),
        queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.all }),
      ]);
    },
    meta: { errorMessage: "Couldn't generate the invoice" },
  });
}
