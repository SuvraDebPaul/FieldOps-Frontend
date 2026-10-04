import { ClipboardCheck, UserCog, Wallet } from "lucide-react";
import type { SidebarItems } from "@/types";

const prefix = "/technician";

export const technicianRoutes: SidebarItems = [
  {
    title: "Work",
    items: [
      { title: "My Jobs", url: prefix, icon: ClipboardCheck },
      { title: "Earnings & Reviews", url: `${prefix}/earnings`, icon: Wallet },
    ],
  },
  {
    title: "Account",
    items: [{ title: "Profile", url: `${prefix}/profile`, icon: UserCog }],
  },
];
