"use client";

import { useRequireAuth } from "@/hooks";
import { Role } from "@/types";
import { ReactNode } from "react";
import AuthLoading from "./auth-loading";
import AccessDenied from "./access-denied";
import { ROLE_HOME } from "@/constants/auth.constants";

interface AuthGuardProps {
  children: ReactNode;
  roles?: Role[];
}

export default function AuthGuard({ children, roles }: AuthGuardProps) {
  const { user, isLoading } = useRequireAuth();

  if (isLoading || !user) return <AuthLoading />;

  if (roles && !roles.includes(user.role)) {
    return <AccessDenied homeUrl={ROLE_HOME[user.role]} />;
  }

  return <>{children}</>;
}
