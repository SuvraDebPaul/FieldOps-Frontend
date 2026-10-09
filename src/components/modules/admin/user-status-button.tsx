"use client";

import { UserCheck, UserX } from "lucide-react";
import { useState } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateUserStatus } from "@/hooks";
import type { UserWithProfile } from "@/types";

export default function UserStatusButton({ user }: { user: UserWithProfile }) {
  const updateStatus = useUpdateUserStatus();
  const [reason, setReason] = useState("");

  if (user.status === "SUSPENDED") {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={updateStatus.isPending}
        onClick={() =>
          updateStatus.mutate({ userId: user.id, status: "ACTIVE" })
        }
      >
        {updateStatus.isPending ? <Spinner /> : <UserCheck />} Reactivate
      </Button>
    );
  }

  return (
    <AlertDialog onOpenChange={(open) => !open && setReason("")}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          <UserX /> Suspend
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suspend {user.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            All their sessions are revoked immediately, and they can&apos;t log
            in until you reactivate the account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Reason (optional, stored in the audit log)"
          aria-label="Suspension reason"
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() =>
              updateStatus.mutate({
                userId: user.id,
                status: "SUSPENDED",
                reason: reason.trim() || undefined,
              })
            }
          >
            Suspend account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
