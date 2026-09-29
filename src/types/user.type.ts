import type { AuthProvider, Role, UserStatus } from "./enums.type";
import type { Site } from "./site.type";
import type { TechnicianProfile, TechnicianSkill } from "./technician.type";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: Role;
  status: UserStatus;
  provider: AuthProvider;
  googleId: string | null;
  avatarUrl: string | null;
  avatarPublicId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  companyName: string;
  billingAddr: string;
}

// GET /admin/users (list)
export interface UserWithProfile extends User {
  customer: CustomerProfile | null;
  technician: (TechnicianProfile & { skills: TechnicianSkill[] }) | null;
}

// GET /users/me and GET /admin/users/:id
export interface UserDetail extends User {
  customer: (CustomerProfile & { sites: Site[] }) | null;
  technician: (TechnicianProfile & { skills: TechnicianSkill[] }) | null;
}

export interface UserParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: Role;
  status?: UserStatus;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  companyName?: string; // customers only
  billingAddr?: string; // customers only
}

export interface UpdateUserStatusPayload {
  status: UserStatus;
  reason?: string;
}

export interface UpdateUserRolePayload {
  role: Role;
}
