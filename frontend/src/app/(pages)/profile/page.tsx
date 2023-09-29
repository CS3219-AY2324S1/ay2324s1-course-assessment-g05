"use client";
import ProfileComponent from "@/components/profile/Profile";
import { useAuthContext } from "@/contexts/auth";

export default function ProfilePage() {
  const { user } = useAuthContext();

  return <>{user && <ProfileComponent user={user} />}</>;
}
