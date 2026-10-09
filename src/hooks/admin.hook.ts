import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getUsers, updateUserRole, updateUserStatus } from "@/api";
import { ROLE_LABEL } from "@/constants/auth.constants";
import type { UserParams } from "@/types";

export const USER_KEYS = {
  all: ["users"] as const,
  list: (params: UserParams) => ["users", "list", params] as const,
};

export function useUsers(params: UserParams) {
  return useQuery({
    queryKey: USER_KEYS.list(params),
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
    meta: { errorMessage: "Couldn't load users" },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserStatus,
    onSuccess: ({ data }) => {
      toast.success(
        data.status === "SUSPENDED"
          ? `${data.name} suspended`
          : `${data.name} reactivated`,
      );
      return queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
    },
    meta: { errorMessage: "Couldn't change the account status" },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: ({ data }) => {
      toast.success(`${data.name} is now ${ROLE_LABEL[data.role]}`);
      return queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
    },
    meta: { errorMessage: "Couldn't change the role" },
  });
}
