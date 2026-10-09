import type { ListParams } from "./api.type";
import type { ServiceCategory, ServiceCategoryBase } from "./catalog.type";
import type { Priority, RequestStatus } from "./enums.type";
import type { Site } from "./site.type";
import type { TechnicianWithUser } from "./technician.type";
import type { CustomerProfile, User } from "./user.type";
import type { WorkOrderBase } from "./work-order.type";

export interface ServiceRequestBase {
  id: string;
  code: string; // SR-2026-000001
  customerId: string;
  siteId: string;
  categoryId: string;
  title: string;
  description: string;
  priority: Priority;
  preferredAt: string | null;
  status: RequestStatus;
  rejectReason: string | null;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// The shape nested inside work orders, invoices and feedback
export interface RequestWithRelations extends ServiceRequestBase {
  site: Site;
  category: ServiceCategoryBase;
  customer: CustomerProfile & { user: User };
}

// GET /requests (list)
export interface ServiceRequest extends RequestWithRelations {
  workOrder: Pick<WorkOrderBase, "id" | "code" | "status"> | null;
}

// GET /requests/:id
export interface ServiceRequestDetail extends RequestWithRelations {
  workOrder: (WorkOrderBase & { technician: TechnicianWithUser }) | null;
}

export interface RequestParams extends ListParams {
  status?: RequestStatus;
  priority?: Priority;
  categoryId?: string;
  siteId?: string;
}

export interface CreateRequestPayload {
  siteId: string;
  categoryId: string;
  title: string;
  description: string;
  priority?: Priority;
  preferredAt?: string; // ISO datetime
}

export type UpdateRequestPayload = Partial<CreateRequestPayload>;

export interface ApproveRequestPayload {
  technicianId: string;
  scheduledStart: string; // ISO
  scheduledEnd: string; // ISO
}

export interface RejectRequestPayload {
  rejectReason: string;
}
