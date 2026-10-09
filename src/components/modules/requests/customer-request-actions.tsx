"use client";

import { SheetFooter } from "@/components/ui/sheet";
import type { ServiceRequestDetail } from "@/types";
import CancelRequestButton from "./cancel-request-button";
import EditRequestDialog from "./edit-request-dialog";

export default function CustomerRequestActions({
  request,
}: {
  request: ServiceRequestDetail;
}) {
  if (request.status !== "PENDING") return null;

  return (
    <SheetFooter className="flex-row gap-2 border-t">
      <EditRequestDialog request={request} />
      <CancelRequestButton request={request} />
    </SheetFooter>
  );
}
