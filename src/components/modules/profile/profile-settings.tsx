"use client";

import { CalendarDays, KeyRound, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLE_LABEL } from "@/constants/auth.constants";
import { useGetMe } from "@/hooks";
import { formatDate } from "@/utils";
import AvatarUploader from "./avatar-uploader";
import ChangePasswordForm from "./change-password-form";
import ProfileForm from "./profile-form";
import TechnicianDetailsCard from "./technician-details-card";

export function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Skeleton className="h-80 rounded-xl" />
      <div className="space-y-6 lg:col-span-2">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
    </div>
  );
}

export default function ProfileSettings() {
  const { data, isPending } = useGetMe(); // already cached by AuthGuard → instant
  const user = data?.data;

  if (isPending || !user) return <ProfileSkeleton />;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="h-fit lg:sticky lg:top-24">
        <CardContent className="space-y-6">
          <AvatarUploader name={user.name} avatarUrl={user.avatarUrl} />
          <div className="space-y-1 text-center">
            <p className="font-heading text-lg font-semibold">{user.name}</p>
            <Badge variant="secondary">{ROLE_LABEL[user.role]}</Badge>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-4 shrink-0" />
              <span className="truncate">{user.email}</span>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <KeyRound className="size-4 shrink-0" />
              {user.provider === "GOOGLE"
                ? "Signs in with Google"
                : "Email & password"}
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="size-4 shrink-0" />
              Member since {formatDate(user.createdAt)}
            </li>
            {user.customer && (
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                <Link
                  href="/dashboard/sites"
                  className="hover:text-foreground hover:underline"
                >
                  {user.customer.sites.length} registered site(s)
                </Link>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>

      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal details</CardTitle>
            <CardDescription>
              Your email ({user.email}) is your login and can&apos;t be changed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} />
          </CardContent>
        </Card>

        {user.technician && (
          <TechnicianDetailsCard technician={user.technician} />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              {user.provider === "GOOGLE"
                ? "Your account uses Google sign-in, so there's no password to change."
                : "Changing it signs you out everywhere."}
            </CardDescription>
          </CardHeader>
          {user.provider !== "GOOGLE" && (
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
