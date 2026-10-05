import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createSite, getSites, updateSite } from "@/api";
import type { SiteParams } from "@/types";

export const SITE_KEYS = {
  all: ["sites"] as const,
  list: (params: SiteParams) => ["sites", "list", params] as const,
};

export function useSites(params: SiteParams) {
  return useQuery({
    queryKey: SITE_KEYS.list(params),
    queryFn: () => getSites(params),
    placeholderData: keepPreviousData,
    meta: { errorMessage: "Couldn't load your sites" },
  });
}

export function useCreateSite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSite,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: SITE_KEYS.all,
      }),
    meta: { errorMessage: "Couldn't add the site" },
  });
}

export function useUpdateSite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSite,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: SITE_KEYS.all,
      }),
    meta: { errorMessage: "Couldn't update the site" },
  });
}
