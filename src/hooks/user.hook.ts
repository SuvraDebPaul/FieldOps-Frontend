import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe, uploadAvatar } from "@/api";
import { ME_QUERY_KEY } from "./auth.hook";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY }),
    meta: { errorMessage: "Couldn't update your profile" },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY }),
    meta: { errorMessage: "Couldn't upload your photo" },
  });
}
