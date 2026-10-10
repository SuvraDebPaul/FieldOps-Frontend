import type { ListParams } from "./api.type";
import type { ServiceCategory, ServiceCategoryBase } from "./catalog.type";
import type { Priority, RequestStatus } from "./enums.type";
import type { Site } from "./site.type";
import type { TechnicianWithUser } from "./technician.type";
import type { CustomerProfile, User } from "./user.type";
import type { WorkOrderBase } from "./work-order.type";

export interface ServiceRequestBase {
  id: string;
  code: string;
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

export interface RequestWithRelations extends ServiceRequestBase {
  site: Site;
  category: ServiceCategoryBase;
  customer: CustomerProfile & { user: User };
}

export interface ServiceRequest extends RequestWithRelations {
  workOrder: Pick<WorkOrderBase, "id" | "code" | "status"> | null;
}

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
  preferredAt?: string;
}

export type UpdateRequestPayload = Partial<CreateRequestPayload>;

export interface ApproveRequestPayload {
  technicianId: string;
  scheduledStart: string;
  scheduledEnd: string;
}

export interface RejectRequestPayload {
  rejectReason: string;
}
