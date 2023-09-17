import { UserService } from "@/helpers/user/user_api_wrappers";
import { Avatar } from "@nextui-org/react";

interface ProfilePictureProps {
  size?: string;
}

const ProfilePictureAvatar = ({ size = "9" }: ProfilePictureProps) => {
  const profileUrl = UserService.getProfileUrl("test");
  return (
    <Avatar
      className={`transition-transform w-${size} h-${size}`}
      src={profileUrl}
    />
  );
};

export default ProfilePictureAvatar;
