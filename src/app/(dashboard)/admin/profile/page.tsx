import type { Metadata } from "next";
import ProfileSettings from "@/components/modules/profile/profile-settings";
import PageHeader from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Profile & settings"
        description="Manage your details, profile photo and password."
      />
      <ProfileSettings />
    </>
  );
}
