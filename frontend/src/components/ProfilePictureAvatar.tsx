import { Avatar } from "@nextui-org/react";

interface ProfilePictureProps {
  width?: string;
}

const ProfilePictureAvatar = ({ width = "9" }: ProfilePictureProps) => (
  <Avatar
    className={`transition-transform w-${width} h-${width}`}
    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
  />
);

export default ProfilePictureAvatar;
