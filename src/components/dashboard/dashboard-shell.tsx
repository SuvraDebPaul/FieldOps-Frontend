"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import UserMenu from "@/components/shared/user-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ROLE_LABEL } from "@/constants/auth.constants";
import { useGetMe } from "@/hooks";
import { useUIStore } from "@/stores";
import type { Role } from "@/types";
import DashboardSidebar from "./dashboard-sidebar";

interface DashboardShellProps {
  role: Role;
  children: ReactNode;
}

export default function DashboardShell({
  role,
  children,
}: DashboardShellProps) {
  // Zustand: two separate selectors → re-renders only when these change
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  // Already cached by AuthGuard → no extra network request
  const { data } = useGetMe();
  const user = data?.data;

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <DashboardSidebar role={role} />

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-muted-foreground">
            {ROLE_LABEL[role]} workspace
          </span>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:inline-flex"
            >
              <Link href="/">View site</Link>
            </Button>
            {user && <UserMenu user={user} />}
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
