"use client"
import React, { FormEvent, useState } from "react";
import ProfileCard from "./ProfileCard";
import { Card, CardBody, CardHeader, Input, Button, Link } from "@nextui-org/react";
import Information from "./Information";
import ChangePassword from "./ChangePassword";
import User from "@/types/user";
import { useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "@/common/constants";

interface ProfileComponentProps {
    user: User;
    saveInformation: (e: FormEvent<HTMLFormElement>, updatedUser: User, preferences: Preference) => void;
}

export default function ProfileComponent({ user, saveInformation }: ProfileComponentProps) {
    const router = useRouter();
    // States
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    // Flags
    const [isChangePassword, setIsChangePassword] = useState(false);

    return (
        <div className="flex flex-col items-center align-middle justify-center h-screen space-y-6">
            <Card className="flex w-unit-8xl">
                <CardHeader className="justify-center">
                    <ProfileCard name={user.name} email={user.email} image={user.image}/>
                </CardHeader>
                <CardBody className="justify-center space-y-5">
                    { isChangePassword ? (
                        <ChangePassword setIsChangePassword={setIsChangePassword}/>
                    ) : (
                        <Information setIsChangePassword={setIsChangePassword} saveInformation={saveInformation} user={user}/>
                    )}
                </CardBody>
            </Card>
            <Button>
                <Link onClick={() => {router.push(CLIENT_ROUTES.HOME)}}>Back to dashboard</Link>
            </Button>
        </div>
    )
}