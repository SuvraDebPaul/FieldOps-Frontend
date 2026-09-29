import type { Skill } from "./catalog.type";
import type { User } from "./user.type";

export interface TechnicianProfile {
  id: string;
  userId: string;
  employeeCode: string;
  baseCity: string;
  hourlyRate: string; // Decimal
  maxDailyJobs: number;
  isAvailable: boolean;
  ratingAvg: string; // Decimal
  ratingCount: number;
}

export interface TechnicianSkill {
  technicianId: string;
  skillId: string;
  level: number;
  skill: Skill;
}

// Used inside work orders, invoices and feedback
export interface TechnicianWithUser extends TechnicianProfile {
  user: User;
}

// GET /technicians (public)
export interface PublicTechnician extends TechnicianProfile {
  user: Pick<User, "id" | "name" | "email" | "phone" | "avatarUrl" | "status">;
  skills: (Omit<TechnicianSkill, "skill"> & {
    skill: Pick<Skill, "id" | "name">;
  })[];
}

export interface TechnicianParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  skill?: string;
  city?: string;
  available?: "true" | "false";
}
