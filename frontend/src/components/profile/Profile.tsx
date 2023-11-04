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
  // Flags
  const [isChangePassword, setIsChangePassword] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageUrl, setImageUrl] = useState<string>("");

  function openModal() {
    if (user.id) {
      onOpen();
    } else {
      displayToast("Unable to perform this action right now.", ToastType.ERROR);
    }
  }

  return (
    <div className="flex flex-col items-center align-middle justify-center h-[94vh]">
      <Card className="flex w-unit-8xl bg-black mb-0">
        <CardBody className="justify-center space-y-5">
          {isChangePassword ? (
            <ChangePassword setIsChangePassword={setIsChangePassword} />
          ) : (
            <>
              <ProfileCard user={user} setImageUrl={setImageUrl} />
              <Information
                setIsChangePassword={setIsChangePassword}
                imageUrl={imageUrl}
                user={user}
              />
            </>
          )}
        </CardBody>
      </Card>
      <div className="flex flex-row justify-end gap-2">
        <Button
          className="text-white bg-sky-600 hover:bg-sky-700 transition-transform flex jusstify-end"
          as={Link}
          href={CLIENT_ROUTES.HOME}
        >
          Back to dashboard
        </Button>
        <Button
          className="bg-red-600 hover:bg-red-700 transition-transform flex justify-end"
          onClick={() => {
            openModal();
          }}
        >
          Delete User
        </Button>
      </div>

      {user.id && (
        <DeleteModal userid={user.id} isOpen={isOpen} onClose={onClose} />
      )}
    </div>
  );
}
