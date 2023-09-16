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
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "@/common/constants";
import PeerPrepLogo from "@/components/common/PeerPrepLogo";
import ProfilePictureAvatar from "./ProfilePictureAvatar";

const NavBar = () => {
  const router = useRouter();
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
                onClick={() => router.push(CLIENT_ROUTES.PROFILE)}
              >
                Edit Profile
              </DropdownItem>
            </DropdownSection>
            <DropdownSection>
              <DropdownItem
                key="logout"
                onClick={() => router.push(CLIENT_ROUTES.LOGOUT)}
              >
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
