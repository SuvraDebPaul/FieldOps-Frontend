import type { ListParams } from "./api.type";
import type { InvoiceStatus, PaymentStatus } from "./enums.type";
import type { RequestWithRelations, ServiceRequestBase } from "./request.type";
import type { TechnicianWithUser } from "./technician.type";
import type { CustomerProfile } from "./user.type";
import type { PartUsage, WorkOrderBase } from "./work-order.type";

export interface InvoiceBase {
  id: string;
  invoiceNo: string;
  workOrderId: string;
  labourHours: string;
  labourAmount: string;
  partsAmount: string;
  vatAmount: string;
  totalAmount: string;
  status: InvoiceStatus;
  dueDate: string;
  issuedAt: string;
  paidAt: string | null;
  deletedAt: string | null;
}

export interface Payment {
  id: string;
  invoiceId: string;
  transactionId: string;
  gatewayRef: string | null;
  amount: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice extends InvoiceBase {
  workOrder: WorkOrderBase & {
    technician: TechnicianWithUser;
    parts: PartUsage[];
    request: RequestWithRelations;
  };
  payments: Payment[];
}

export interface InvoiceParams extends ListParams {
  status?: InvoiceStatus;
  from?: string;
  to?: string;
}

export interface InitiatePaymentResponse {
  transactionId: string;
  invoiceNo: string;
  amount: number;
  currency: string;
  checkoutUrl: string | null;
}

export interface PaymentDetail extends Payment {
  invoice: InvoiceBase & {
    workOrder: WorkOrderBase & {
      request: ServiceRequestBase & { customer: CustomerProfile };
    };
  };
}
