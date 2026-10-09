import {
  keepPreviousData,
  skipToken,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  approveRequest,
  cancelRequest,
  createRequest,
  deleteRequest,
  getRequest,
  getRequests,
  rejectRequest,
  updateRequest,
} from "@/api";
import type {
  ApiResponse,
  PaginatedResponse,
  RequestParams,
  RequestStatus,
  ServiceRequest,
  ServiceRequestDetail,
} from "@/types";
import { WORK_ORDER_KEYS } from "./work-order.hook";

export const REQUEST_KEYS = {
  all: ["requests"] as const,
  lists: ["requests", "list"] as const,
  list: (params: RequestParams) => ["requests", "list", params] as const,
  detail: (requestId: string) => ["requests", "detail", requestId] as const,
};

export function useRequests(params: RequestParams) {
  return useQuery({
    queryKey: REQUEST_KEYS.list(params),
    queryFn: () => getRequests(params),
    placeholderData: keepPreviousData,
    meta: { errorMessage: "Couldn't load requests" },
  });
}

export function useRequest(requestId: string | null) {
  return useQuery({
    queryKey: REQUEST_KEYS.detail(requestId ?? ""),
    queryFn: requestId ? () => getRequest(requestId) : skipToken,
    select: (res) => res.data,
    meta: { errorMessage: "Couldn't load this request" },
  });
}

export function useRequestStatusCounts(statuses: readonly RequestStatus[]) {
  return useQueries({
    queries: statuses.map((status) => ({
      queryKey: REQUEST_KEYS.list({ status, limit: 1 }),
      queryFn: () => getRequests({ status, limit: 1 }),
      select: (res: PaginatedResponse<ServiceRequest>) => res.meta.total,
    })),
    combine: (results) => ({
      counts: Object.fromEntries(
        statuses.map((status, i) => [status, results[i].data ?? 0]),
      ) as Record<RequestStatus, number>,
      isPending: results.some((result) => result.isPending),
    }),
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.all }),
    meta: { errorMessage: "Couldn't submit your request" },
  });
}

export function useUpdateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.all }),
    meta: { errorMessage: "Couldn't update the request" },
  });
}

export function useCancelRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelRequest,
    onMutate: async (requestId) => {
      await queryClient.cancelQueries({ queryKey: REQUEST_KEYS.all });
      const previousLists = queryClient.getQueriesData<
        PaginatedResponse<ServiceRequest>
      >({
        queryKey: REQUEST_KEYS.lists,
      });
      const previousDetail = queryClient.getQueryData<
        ApiResponse<ServiceRequestDetail>
      >(REQUEST_KEYS.detail(requestId));
      queryClient.setQueriesData<PaginatedResponse<ServiceRequest>>(
        { queryKey: REQUEST_KEYS.lists },
        (old) =>
          old && {
            ...old,
            data: old.data.map((r) =>
              r.id === requestId ? { ...r, status: "CANCELLED" as const } : r,
            ),
          },
      );
      queryClient.setQueryData<ApiResponse<ServiceRequestDetail>>(
        REQUEST_KEYS.detail(requestId),
        (old) => old && { ...old, data: { ...old.data, status: "CANCELLED" } },
      );

      return { previousLists, previousDetail };
    },
    onError: (_error, requestId, snapshot) => {
      for (const [key, data] of snapshot?.previousLists ?? []) {
        queryClient.setQueryData(key, data);
      }
      if (snapshot?.previousDetail) {
        queryClient.setQueryData(
          REQUEST_KEYS.detail(requestId),
          snapshot.previousDetail,
        );
      }
    },
    onSuccess: ({ data }) => toast.success(`${data.code} cancelled`),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.all }),

    meta: { errorMessage: "Couldn't cancel the request" },
  });
}

export function useApproveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveRequest,
    // Toast in the hook: approving flips the status, which unmounts the dialog that called it
    onSuccess: ({ data }) => {
      toast.success(`Approved: work order ${data.code} created`);
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.all }),
        queryClient.invalidateQueries({ queryKey: WORK_ORDER_KEYS.all }),
      ]);
    },
    meta: { errorMessage: "Couldn't approve the request" },
  });
}

export function useRejectRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectRequest,
    onSuccess: ({ data }) => {
      toast.success(`${data.code} rejected`);
      return queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.all });
    },
    meta: { errorMessage: "Couldn't reject the request" },
  });
}

export function useDeleteRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRequest,
    onSuccess: () => {
      toast.success("Request deleted");
      return queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.all });
    },
    meta: { errorMessage: "Couldn't delete the request" },
  });
}
