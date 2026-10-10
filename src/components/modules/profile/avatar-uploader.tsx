"use client";

import { Camera } from "lucide-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import UserAvatar from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { useUploadAvatar } from "@/hooks";
import { formatFileSize } from "@/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 4 * 1024 * 1024;

interface AvatarUploaderProps {
  name: string;
  avatarUrl: string | null;
}

export default function AvatarUploader({
  name,
  avatarUrl,
}: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const uploadAvatar = useUploadAvatar();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clearSelection = () => {
    setFile(null);
    setPreviewUrl(null);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      toast.error("Please choose a JPEG, PNG or WEBP image");
      e.target.value = "";
      return;
    }
    if (selected.size > MAX_BYTES) {
      toast.error("Image must be 4 MB or smaller", {
        description: `This one is ${formatFileSize(selected.size)}.`,
      });
      e.target.value = "";
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setProgress(0);
  };

  const handleUpload = () => {
    if (!file) return;
    uploadAvatar.mutate(
      { file, onProgress: setProgress },
      {
        onSuccess: () => {
          toast.success("Profile photo updated");
          clearSelection();
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Preview of your new profile photo"
          className="size-24 rounded-full object-cover ring-2 ring-primary ring-offset-2"
        />
      ) : (
        <UserAvatar name={name} src={avatarUrl} size={96} />
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleSelect}
        className="hidden"
        aria-hidden
        tabIndex={-1}
      />

      {file ? (
        <div className="w-full space-y-3">
          <p className="truncate text-xs text-muted-foreground">
            {file.name} · {formatFileSize(file.size)}
          </p>

          {uploadAvatar.isPending && (
            <div className="space-y-1">
              <Progress value={progress} aria-label="Upload progress" />
              <p className="text-xs text-muted-foreground" aria-live="polite">
                {progress < 100 ? `${progress}% uploaded` : "Processing…"}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={clearSelection}
              disabled={uploadAvatar.isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleUpload}
              disabled={uploadAvatar.isPending}
            >
              {uploadAvatar.isPending && <Spinner />} Upload photo
            </Button>
          </div>
        </div>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          <Camera /> Change photo
        </Button>
      )}

      <p className="text-xs text-muted-foreground">
        JPEG, PNG or WEBP, up to 4 MB.
      </p>
    </div>
  );
}
