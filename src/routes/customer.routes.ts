import {
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  MapPin,
  PlusCircle,
  UserCog,
  Wrench,
} from "lucide-react";
import type { SidebarItems } from "@/types";

const prefix = "/dashboard";

export const customerRoutes: SidebarItems = [
  {
    title: "Service",
    items: [
      { title: "Overview", url: prefix, icon: LayoutDashboard },
      { title: "New Request", url: `${prefix}/requests/new`, icon: PlusCircle },
      { title: "My Requests", url: `${prefix}/requests`, icon: ClipboardList },
      { title: "Work Orders", url: `${prefix}/work-orders`, icon: Wrench },
    ],
  },
  {
    title: "Company",
    items: [
      { title: "Sites", url: `${prefix}/sites`, icon: MapPin },
      { title: "Payments", url: `${prefix}/payments`, icon: CreditCard },
    ],
  },
  {
    title: "Account",
    items: [{ title: "Profile", url: `${prefix}/profile`, icon: UserCog }],
  },
];
