import type { Role, SidebarItems } from "@/types";
import { adminRoutes } from "./admin.routes";
import { customerRoutes } from "./customer.routes";
import { technicianRoutes } from "./technician.routes";

export const SIDEBAR_ROUTES: Record<Role, SidebarItems> = {
  ADMIN: adminRoutes,
  CUSTOMER: customerRoutes,
  TECHNICIAN: technicianRoutes,
};

export * from "./public.routes";
