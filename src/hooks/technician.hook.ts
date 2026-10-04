import { getTechnicians } from "@/api";
import { TechnicianParams } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useTechnicians(params: TechnicianParams) {
  return useQuery({
    queryKey: ["technicians", params],
    queryFn: () => getTechnicians(params),
    placeholderData: keepPreviousData,
    meta: { errorMessage: "Couldn't load technicians" },
  });
}
