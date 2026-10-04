"use client";

import Link from "next/link";
import UserMenu from "@/components/shared/user-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks";

export default function HeaderAuth() {
  const { data, isPending } = useGetMe();
  const user = data?.data;

  if (isPending) return <Skeleton className="h-9 w-28" />;

  if (user) return <UserMenu user={user} />;

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" asChild className="hidden sm:inline-flex">
        <Link href="/login">Log in</Link>
      </Button>
      <Button asChild>
        <Link href="/register">Get started</Link>
      </Button>
    </div>
  );
}
