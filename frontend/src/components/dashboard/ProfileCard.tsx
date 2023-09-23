"use client";
import { Button } from "@nextui-org/react";
import ProfilePictureAvatar from "@/components/common/ProfilePictureAvatar";
import { UserService, getUser } from "@/helpers/user/user_api_wrappers";
import { useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "@/common/constants";
import { get } from "http";

const ProfileCard = () => {
  const router = useRouter();
  const username = UserService.getUsername();
  // const user = getUser(email);

  const handleEditProfileButtonPress = () => {
    router.push(CLIENT_ROUTES.PROFILE);
  };

  return (
    <div className="flex flex-col h-full justify-center gap-4 items-center bg-black rounded-lg p-6 overflow-hidden">
      <ProfilePictureAvatar profileUrl={image} size="300" />
      <p className="text-white text-3l font-semibold">{name}</p>
      <Button variant="bordered" onPress={handleEditProfileButtonPress}>
        Edit Profile
      </Button>
    </div>
  );
};

export default ProfileCard;
