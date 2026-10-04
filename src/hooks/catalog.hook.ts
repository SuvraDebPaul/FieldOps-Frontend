import { getSkills } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
    staleTime: 60 * 60 * 1000,
    select: (res) => res.data,
  });
}
