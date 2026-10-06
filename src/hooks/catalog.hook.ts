import { useQuery } from "@tanstack/react-query";
import { getCategories, getSkills } from "@/api";
import type { CategoryParams } from "@/types";

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
    staleTime: 60 * 60 * 1000,
    select: (res) => res.data,
  });
}

export function useCategories(params: CategoryParams) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
    staleTime: 10 * 60 * 1000,
    meta: { errorMessage: "Couldn't load services" },
  });
}
