"use client";

import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import { useDeleteRequest, useQueryParams } from "@/hooks";
import type { ServiceRequestDetail } from "@/types";
import ApproveRequestDialog from "./approve-request-dialog";
import RejectRequestDialog from "./reject-request-dialog";

export default function AdminRequestActions({
  request,
}: {
  request: ServiceRequestDetail;
}) {
  const { setParams } = useQueryParams();
  const deleteRequest = useDeleteRequest();

  const isPending = request.status === "PENDING";
  const canDelete = request.status !== "CONVERTED";

  if (!isPending && !canDelete) return null;

  return (
    <SheetFooter className="flex-row flex-wrap gap-2 border-t">
      {isPending && (
        <>
          <ApproveRequestDialog request={request} />
          <RejectRequestDialog request={request} />
        </>
      )}
      {canDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {request.code}?</AlertDialogTitle>
              <AlertDialogDescription>
                It is hidden from every list. The record is kept for the audit
                trail (soft delete).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => {
                  setParams({ view: null });
                  deleteRequest.mutate(request.id);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </SheetFooter>
  );
}
