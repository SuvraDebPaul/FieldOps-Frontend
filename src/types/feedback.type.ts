import type { ListParams } from "./api.type";
import type { RequestWithRelations } from "./request.type";
import type { TechnicianWithUser } from "./technician.type";
import type { WorkOrderBase } from "./work-order.type";

export interface FeedbackBase {
  id: string;
  workOrderId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface Feedback extends FeedbackBase {
  workOrder: WorkOrderBase & {
    technician: TechnicianWithUser;
    request: RequestWithRelations;
  };
}

export interface FeedbackParams extends ListParams {
  rating?: number;
  technicianId?: string;
}

export interface SubmitFeedbackPayload {
  rating: number;
  comment?: string;
}
