"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/shared/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { ROLE_HOME } from "@/constants/auth.constants";
import { SIDEBAR_ROUTES } from "@/routes";
import type { Role } from "@/types";
import { getActiveUrl } from "@/utils";

export default function DashboardSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const groups = SIDEBAR_ROUTES[role];
  const activeUrl = getActiveUrl(pathname, groups);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center border-b px-3">
        <Logo href={ROLE_HOME[role]} />
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.url === activeUrl}
                        tooltip={item.title}
                      >
                        <Link
                          href={item.url}
                          onClick={() => setOpenMobile(false)}
                        >
                          <Icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
