"use client";
import { Button } from "@nextui-org/react";
import ProfilePictureAvatar from "@/components/common/ProfilePictureAvatar";
import { useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "@/common/constants";
import { useAuthContext } from "@/contexts/auth";

const ProfileDashboardCard = () => {
  const { user } = useAuthContext();
  const router = useRouter();

  const handleEditProfileButtonPress = () => {
    router.push(CLIENT_ROUTES.PROFILE);
  };

  return (
    <div className="flex flex-col h-full justify-center gap-4 items-center bg-black rounded-lg p-6 overflow-hidden">
      <ProfilePictureAvatar profileUrl={user.image!} size="40" />
      <p className="text-white text-3l font-semibold">{user.name}</p>
      <Button variant="bordered" onPress={handleEditProfileButtonPress}>
        Edit Profile
      </Button>
    </div>
  );
};

export default ProfileDashboardCard;
