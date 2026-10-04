"use client";

import { LayoutDashboard, LogOut, UserCog } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_HOME, ROLE_LABEL } from "@/constants/auth.constants";
import { useLogout } from "@/hooks";
import type { User } from "@/types";
import UserAvatar from "./user-avatar";

interface UserMenuProps {
  user: Pick<User, "name" | "email" | "role" | "avatarUrl">;
}

export default function UserMenu({ user }: UserMenuProps) {
  const { mutate: logout, isPending } = useLogout();
  const home = ROLE_HOME[user.role];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 gap-2 px-2"
          aria-label="Open account menu"
        >
          <UserAvatar name={user.name} src={user.avatarUrl} size={28} />
          <span className="hidden max-w-32 truncate text-sm font-medium md:inline">
            {user.name}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <Badge variant="secondary" className="mt-2">
            {ROLE_LABEL[user.role]}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={home}>
            <LayoutDashboard /> Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`${home}/profile`}>
            <UserCog /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onSelect={() => logout()}
        >
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
