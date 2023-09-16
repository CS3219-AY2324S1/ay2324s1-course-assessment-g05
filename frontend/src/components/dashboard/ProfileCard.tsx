"use client";
import { Button } from "@nextui-org/react";
import ProfilePictureAvatar from "@/components/common/ProfilePictureAvatar";
import { UserService } from "@/helpers/user/api_wrappers";
import { useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "@/common/constants";

const ProfileCard = () => {
  const router = useRouter();
  const username = UserService.getUsername();
  return (
    <div className="flex flex-col h-full justify-center gap-4 items-center bg-black rounded-lg p-6">
      <ProfilePictureAvatar size="300" />
      <p className="text-white text-3l font-semibold">{username}</p>
      <Button
        variant="bordered"
        onPress={() => router.push(CLIENT_ROUTES.PROFILE)}
      >
        Edit Profile
      </Button>
    </div>
  );
};

export default ProfileCard;
