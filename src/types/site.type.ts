import type { ListParams } from "./api.type";
import type { CustomerProfile } from "./user.type";

export interface Site {
  id: string;
  customerId: string;
  label: string;
  address: string;
  city: string;
  contactName: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  customer?: Pick<CustomerProfile, "id" | "companyName">; // only on GET /sites
}

export interface SiteParams extends ListParams {
  city?: string;
  customerId?: string; // admin only
}

export interface SitePayload {
  label: string;
  address: string;
  city: string;
  contactName: string;
  contactPhone: string;
}

export type UpdateSitePayload = Partial<SitePayload>;
