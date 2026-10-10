import { FetchError, type FetchOptions, ofetch } from "ofetch";

const isServer = typeof window === "undefined";

const BASE_URL = isServer
  ? `${process.env.BACKEND_URL ?? "http://localhost:5000"}/api/v1`
  : "/api/v1";

const baseClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

let refreshing: Promise<unknown> | null = null;

function refreshSession() {
  refreshing ??= baseClient("/auth/refresh-token", { method: "POST" }).finally(
    () => {
      refreshing = null;
    },
  );
  return refreshing;
}

export async function apiClient<T>(
  url: string,
  options: FetchOptions<"json"> = {},
): Promise<T> {
  try {
    return await baseClient<T>(url, options);
  } catch (error) {
    const shouldRefresh =
      !isServer &&
      error instanceof FetchError &&
      error.status === 401 &&
      !url.startsWith("/auth/");

    if (!shouldRefresh) {
      throw error;
    }
    try {
      await refreshSession();
    } catch {
      throw error;
    }

    return baseClient<T>(url, options);
  }
}
