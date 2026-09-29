import type { User } from "./user.type";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyName: string;
  billingAddr: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
