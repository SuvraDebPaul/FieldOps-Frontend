import { FetchError } from "ofetch";
import type { ApiErrorResponse } from "@/types";

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong, Please try again",
) {
  if (error instanceof FetchError) {
    const data = error.data as ApiErrorResponse | undefined;
    if (data?.errors?.length) return data.errors[0].message;
    return data?.message ?? fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
