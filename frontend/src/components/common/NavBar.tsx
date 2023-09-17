"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "@/common/constants";
import PeerPrepLogo from "@/components/common/PeerPrepLogo";
import ProfilePictureAvatar from "./ProfilePictureAvatar";
import { UserService } from "@/helpers/user/api_wrappers";
import { MatchingService } from "@/helpers/matching/api_wrappers";

const NavBar = () => {
  const router = useRouter();

  const handleQuickMatchButtonPress = () => {
    const preferences = UserService.getUserPreferences();
    MatchingService.submitMatchPreferences(preferences);
  };
  const handleEditProfileButtonPress = () => {
    router.push(CLIENT_ROUTES.PROFILE);
  };
  const handleLogoutButtonPress = () => {
    router.push(CLIENT_ROUTES.LOGOUT);
  };

  return (
    <Navbar className="bg-black justify-stretch" maxWidth="full" height="50px">
      <NavbarBrand className="flex-grow-0">
        <Link href={CLIENT_ROUTES.HOME}>
          <PeerPrepLogo width="30px" height="30px" />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem>
          <Link className="text-light-blue" href={CLIENT_ROUTES.QUESTIONS}>
            Questions
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent as="div" justify="end">
        <Button
          className="bg-yellow text-black h-[30px]"
          onPress={handleQuickMatchButtonPress}
        >
          Quick Match
        </Button>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <button className="outline-none">
              <ProfilePictureAvatar />
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions">
            <DropdownSection showDivider>
              <DropdownItem
                key="profile"
                onClick={handleEditProfileButtonPress}
              >
                Edit Profile
              </DropdownItem>
            </DropdownSection>
            <DropdownSection>
              <DropdownItem key="logout" onClick={handleLogoutButtonPress}>
                Logout
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};

export default NavBar;
