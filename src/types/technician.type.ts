import type { Skill } from "./catalog.type";
import type { User } from "./user.type";

export interface TechnicianProfile {
  id: string;
  userId: string;
  employeeCode: string;
  baseCity: string;
  hourlyRate: string;
  maxDailyJobs: number;
  isAvailable: boolean;
  ratingAvg: string;
  ratingCount: number;
}

export interface TechnicianSkill {
  technicianId: string;
  skillId: string;
  level: number;
  skill: Skill;
}

export interface TechnicianWithUser extends TechnicianProfile {
  user: User;
}

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
