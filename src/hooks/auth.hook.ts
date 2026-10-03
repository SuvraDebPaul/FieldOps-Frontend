import { getMe, userLogin, userLogout, userRegister } from "@/api";
import { ROLE_HOME } from "@/constants/auth.constants";
import { useRequestWizardStore } from "@/stores";
import { LoginPayload } from "@/types";
import { getErrorMessage } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export const ME_QUERY_KEY = ["me"] as const;

export function useGetMe() {
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  return useMutation({ mutationFn: userLogin });
}
export function useRegister() {
  return useMutation({ mutationFn: userRegister });
}

export function useLogout() {
  return useMutation({
    mutationFn: userLogout,
    onSettled: () => {
      useRequestWizardStore.getState().reset();
      useRequestWizardStore.persist.clearStorage();
      window.location.assign("/login");
    },
  });
}
export function useLoginWithRedirect(redirectTo?: string | null) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useLogin();

  const login = (payload: LoginPayload) => {
    mutation.mutate(payload, {
      onSuccess: ({ data }) => {
        queryClient.removeQueries({ queryKey: ME_QUERY_KEY });
        toast.success(`Welcome Back ${data.user.name}`);
        const home = ROLE_HOME[data.user.role];
        router.replace(redirectTo?.startsWith(home) ? redirectTo : home);
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
    return {
      login,
      isPending: mutation.isPending,
      pendingEmail: mutation.isPending ? mutation.variables?.email : null,
    };
  };
}

export function useRequireAuth() {
  const { data, isPending, isError } = useGetMe();
  const { mutate: logout } = useLogout();

  useEffect(() => {
    if (isError) logout();
  }, [isError, logout]);
  return { user: data?.data, isLoading: isPending || isError };
}
