import { UserService } from "@/helpers/user/user_api_wrappers";
import User from "@/types/user";
import { Avatar } from "@nextui-org/react";

interface ProfilePictureProps {
  profileUrl: string;
  size?: string;
}

const ProfilePictureAvatar = ({
  profileUrl,
  size = "9",
}: ProfilePictureProps) => {
  return (
    <Avatar
      className={`transition-transform w-${size} h-${size}`}
      src={profileUrl}
    />
  );
};

export default ProfilePictureAvatar;
