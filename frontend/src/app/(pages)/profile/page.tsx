"use client";
import ProfileComponent from "@/components/profile/Profile";
import { useAuthContext } from "@/providers/auth";

export default function ProfilePage() {
  const { user } = useAuthContext();

  return <>{user && <ProfileComponent user={user} />}</>;
}
