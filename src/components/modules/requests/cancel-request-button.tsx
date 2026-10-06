"use client";

import { XCircle } from "lucide-react";
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
import { useCancelRequest } from "@/hooks";
import type { ServiceRequestBase } from "@/types";

export default function CancelRequestButton({
  request,
}: {
  request: Pick<ServiceRequestBase, "id" | "code">;
}) {
  const cancelRequest = useCancelRequest();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive"
        >
          <XCircle /> Cancel request
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel {request.code}?</AlertDialogTitle>
          <AlertDialogDescription>
            The request will be withdrawn and won&apos;t be scheduled. This
            can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep request</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => cancelRequest.mutate(request.id)}
          >
            Cancel request
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
