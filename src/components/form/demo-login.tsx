"use client";

import { Building2, type LucideIcon, ShieldCheck, Wrench } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { DEMO_ACCOUNTS } from "@/constants/auth.constants";
import type { Role } from "@/types";

const ROLE_ICON: Record<Role, LucideIcon> = {
  ADMIN: ShieldCheck,
  CUSTOMER: Building2,
  TECHNICIAN: Wrench,
};

interface DemoLoginProps {
  onSelect: (email: string) => void;
  pendingEmail?: string;
  disabled?: boolean;
}

export default function DemoLogin({
  onSelect,
  pendingEmail,
  disabled,
}: DemoLoginProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {DEMO_ACCOUNTS.map((account) => {
        const Icon = ROLE_ICON[account.role];
        const isLoading = pendingEmail === account.email;

        return (
          <button
            key={account.role}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(account.email)}
            aria-label={`Demo login as ${account.label}`}
            className="flex flex-col items-start gap-1 rounded-lg border bg-card p-3 text-left transition-colors hover:border-primary hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-60"
          >
            <span className="flex items-center gap-2 font-medium">
              {isLoading ? (
                <Spinner />
              ) : (
                <Icon className="size-4 text-primary" />
              )}
              {account.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {account.description}
            </span>
            <span className="mt-1 text-xs font-medium text-primary">
              Demo login →
            </span>
          </button>
        );
      })}
    </div>
  );
}
