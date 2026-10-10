import type { ListParams } from "./api.type";
import type { WorkOrderStatus } from "./enums.type";
import type { InvoiceBase } from "./invoice.type";
import type { RequestWithRelations } from "./request.type";
import type { TechnicianWithUser } from "./technician.type";

export interface WorkOrderBase {
  id: string;
  code: string;
  requestId: string;
  technicianId: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  status: WorkOrderStatus;
  diagnosis: string | null;
  workSummary: string | null;
  reportUrl: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PartUsage {
  id: string;
  workOrderId: string;
  name: string;
  quantity: number;
  unitPrice: string;
  createdAt: string;
}

export interface WorkOrderHistory {
  id: string;
  workOrderId: string;
  fromStatus: WorkOrderStatus | null;
  toStatus: WorkOrderStatus;
  changedById: string;
  note: string | null;
  createdAt: string;
}

export interface WorkOrder extends WorkOrderBase {
  technician: TechnicianWithUser;
  request: RequestWithRelations;
  parts: PartUsage[];
  invoice: InvoiceBase | null;
}

export interface WorkOrderDetail extends WorkOrder {
  history: WorkOrderHistory[];
}

export interface WorkOrderParams extends ListParams {
  status?: WorkOrderStatus;
  technicianId?: string;
  from?: string;
  to?: string;
}

export interface ChangeStatusPayload {
  status: WorkOrderStatus;
  note?: string;
  diagnosis?: string;
  workSummary?: string;
  cancelReason?: string;
}

export interface ReschedulePayload {
  scheduledStart: string;
  scheduledEnd: string;
  note?: string;
}

export interface AddPartPayload {
  name: string;
  quantity: number;
  unitPrice: number;
}
