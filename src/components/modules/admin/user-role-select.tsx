"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_LABEL } from "@/constants/auth.constants";
import { useUpdateUserRole } from "@/hooks";
import { ROLES, type UserWithProfile } from "@/types";
import { isOneOf } from "@/utils";

export default function UserRoleSelect({
  user,
  disabled,
}: {
  user: UserWithProfile;
  disabled?: boolean;
}) {
  const updateRole = useUpdateUserRole();

  return (
    <Select
      value={user.role}
      disabled={disabled || updateRole.isPending}
      onValueChange={(role) => {
        if (isOneOf(ROLES, role)) updateRole.mutate({ userId: user.id, role });
      }}
    >
      <SelectTrigger className="h-8 w-36" aria-label={`Role of ${user.name}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((role) => {
          const missingProfile =
            (role === "TECHNICIAN" && !user.technician) ||
            (role === "CUSTOMER" && !user.customer);
          return (
            <SelectItem key={role} value={role} disabled={missingProfile}>
              {ROLE_LABEL[role]}
              {missingProfile && " (no profile)"}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
