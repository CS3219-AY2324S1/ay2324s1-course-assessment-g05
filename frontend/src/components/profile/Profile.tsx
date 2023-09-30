"use client";
import React, { FormEvent, useState } from "react";
import ProfileCard from "./ProfileCard";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Link,
  useDisclosure,
} from "@nextui-org/react";
import Information from "./Information";
import ChangePassword from "./ChangePassword";
import DeleteModal from "./DeleteModal";
import User from "@/types/user";
import { useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "@/common/constants";
import displayToast from "../common/Toast";
import { ToastType } from "@/types/enums";

interface ProfileComponentProps {
  user: User;
}

export default function ProfileComponent({ user }: ProfileComponentProps) {
  const router = useRouter();

  // Flags
  const [isChangePassword, setIsChangePassword] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  function openModal() {
    if (user.id) {
      onOpen();
    } else {
      displayToast("Unable to perform this action right now.", ToastType.ERROR);
    }
  }

  return (
    <div className="flex flex-col items-center align-middle justify-center h-screen space-y-6">
      <Card className="flex w-unit-8xl">
        <CardHeader className="justify-center">
          <ProfileCard
            name={user.name}
            email={user.email}
            image={
              user.image
                ? user.image
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
          />
        </CardHeader>
        <CardBody className="justify-center space-y-5">
          {isChangePassword ? (
            <ChangePassword setIsChangePassword={setIsChangePassword} />
          ) : (
            <Information setIsChangePassword={setIsChangePassword} />
          )}
        </CardBody>
      </Card>
      <Button>
        <Link
          onClick={() => {
            router.push(CLIENT_ROUTES.HOME);
          }}
        >
          Back to dashboard
        </Link>
      </Button>
      <Button
        className="bg-red-700"
        onClick={() => {
          openModal();
        }}
      >
        Delete User
      </Button>
      {user.id && (
        <DeleteModal userid={user.id} isOpen={isOpen} onClose={onClose} />
      )}
    </div>
  );
}
