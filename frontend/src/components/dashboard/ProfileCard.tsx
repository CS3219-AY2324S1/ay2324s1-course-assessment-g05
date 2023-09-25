"use client";
import { Button } from "@nextui-org/react";
import ProfilePictureAvatar from "@/components/common/ProfilePictureAvatar";
import { UserService } from "@/helpers/user/user_api_wrappers";
import { useRouter, useParams } from "next/navigation";
import { CLIENT_ROUTES } from "@/common/constants";
import User from "@/types/user";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/providers/auth";


const ProfileCard = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | undefined>(undefined);

  const email = typeof window !== "undefined" ? sessionStorage.getItem("email") || "" : "";

  useEffect(() => {
      fetchUser();
  }, [])

  const fetchUser = async () => {
      const rawUser = await UserService.getUserByEmail(email);
      console.log("User retrieved: " + JSON.stringify(rawUser));
      setUser(rawUser);
  }

  const handleEditProfileButtonPress = () => {
    router.push(CLIENT_ROUTES.PROFILE);
  };

  return (
    <div className="flex flex-col h-full justify-center gap-4 items-center bg-black rounded-lg p-6 overflow-hidden">
      <ProfilePictureAvatar profileUrl={ user && user.image ? user.image : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} size="300" />
      <p className="text-white text-3l font-semibold">{user ? user.name : ""}</p>
      <Button variant="bordered" onPress={handleEditProfileButtonPress}>
        Edit Profile
      </Button>
    </div>
  );
};

export default ProfileCard;
