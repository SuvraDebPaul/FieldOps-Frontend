import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getSkills,
  createCategory,
  createSkill,
  deleteCategory,
  updateCategory,
} from "@/api";
import type { CategoryParams } from "@/types";
import { toast } from "sonner";

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

/** Categories and skills affect each other (skill usage counts), so refresh both. */
function useInvalidateCatalog() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
      queryClient.invalidateQueries({ queryKey: ["skills"] }),
    ]);
}

export function useCreateCategory() {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: invalidate,
    meta: { errorMessage: "Couldn't create the service" },
  });
}

export function useUpdateCategory() {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: invalidate,
    meta: { errorMessage: "Couldn't update the service" },
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: ({ data }) => {
      toast.success(`"${data.name}" removed from the catalog`);
      return invalidate();
    },
    meta: { errorMessage: "Couldn't remove the service" },
  });
}

export function useCreateSkill() {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: createSkill,
    onSuccess: invalidate,
    meta: { errorMessage: "Couldn't add the skill" },
  });
}
