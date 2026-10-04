import {
  BarChart3,
  ClipboardList,
  Layers,
  LayoutDashboard,
  Receipt,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";
import type { SidebarItems } from "@/types";

const prefix = "/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "Operations",
    items: [
      { title: "Overview", url: prefix, icon: LayoutDashboard },
      {
        title: "Service Requests",
        url: `${prefix}/requests`,
        icon: ClipboardList,
      },
      { title: "Work Orders", url: `${prefix}/work-orders`, icon: Wrench },
      { title: "Invoices", url: `${prefix}/invoices`, icon: Receipt },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Users", url: `${prefix}/users`, icon: Users },
      { title: "Service Catalog", url: `${prefix}/catalog`, icon: Layers },
      { title: "Reports", url: `${prefix}/reports`, icon: BarChart3 },
    ],
  },
  {
    title: "Account",
    items: [{ title: "Profile", url: `${prefix}/profile`, icon: UserCog }],
  },
];
