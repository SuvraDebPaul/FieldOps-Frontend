import { apiClient } from "@/lib/apiClient";
import type {
  ApiErrorResponse,
  ApiResponse,
  UpdateProfilePayload,
  User,
} from "@/types";

export function updateMe(payload: UpdateProfilePayload) {
  return apiClient<ApiResponse<User>>("/users/me", {
    method: "PATCH",
    body: payload,
  });
}

interface AvatarUploadResult {
  avatarUrl: string | null;
  avatarPublicId: string | null;
}

export function uploadAvatar({
  file,
  onProgress,
}: {
  file: File;
  onProgress?: (percent: number) => void;
}) {
  return new Promise<ApiResponse<AvatarUploadResult>>((resolve, reject) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const xhr = new XMLHttpRequest();
    xhr.open("PATCH", "/api/v1/users/me/avatar");
    xhr.withCredentials = true;
    xhr.responseType = "json";

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        const body = xhr.response as ApiErrorResponse | null;
        reject(new Error(body?.message ?? "Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error while uploading"));
    xhr.send(formData);
  });
}
