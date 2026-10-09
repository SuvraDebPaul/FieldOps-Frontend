import type { ListParams } from "./api.type";

export interface Skill {
  id: string;
  name: string;
  _count?: { technicians: number; categories: number }; // only on GET /skills
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  requiredSkillId: string;
  baseCharge: string; // Decimal
  estimatedMins: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  requiredSkill: Skill;
}

export interface CategoryParams extends ListParams {
  requiredSkillId?: string;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  requiredSkillId: string;
  baseCharge: number;
  estimatedMins: number;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload> & {
  isActive?: boolean;
};

export interface CreateSkillPayload {
  name: string;
}

export type ServiceCategoryBase = Omit<ServiceCategory, "requiredSkill">;
