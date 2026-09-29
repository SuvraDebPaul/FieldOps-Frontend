export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Meta; // your backend only sends meta on list endpoints
}

// Use this for list endpoints so `meta` is guaranteed
export type PaginatedResponse<T> = ApiResponse<T[]> & { meta: Meta };

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: { path: string; message: string }[];
}

export interface ListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
