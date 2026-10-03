import type { Role } from "@/types";

export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  CUSTOMER: "/dashboard",
  TECHNICIAN: "/technician",
};

export const DEMO_PASSWORD = "Admin@12345";

export const DEMO_ACCOUNTS: {
  role: Role;
  label: string;
  description: string;
  email: string;
}[] = [
  {
    role: "ADMIN",
    label: "Admin",
    description: "Dispatch jobs, manage users and the catalog",
    email: "admin@gmail.com",
  },
  {
    role: "CUSTOMER",
    label: "Customer",
    description: "Raise requests, track jobs, pay invoices",
    email: "corp1@apextextiles.com",
  },
  {
    role: "TECHNICIAN",
    label: "Technician",
    description: "Run assigned jobs and log parts used",
    email: "tech.rahim@gmail.com",
  },
];
