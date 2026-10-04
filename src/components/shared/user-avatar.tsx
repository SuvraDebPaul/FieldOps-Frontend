import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  name,
  src,
  size = 32,
  className,
}: UserAvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary",
        className,
      )}
    >
      {initials}
    </span>
  );
}
