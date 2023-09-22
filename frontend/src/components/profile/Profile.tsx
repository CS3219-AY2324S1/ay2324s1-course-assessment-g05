"use client"
import React, { useState } from "react";
import ProfileCard from "./ProfileCard";
import { Card, CardBody, CardHeader, Input, Button, Link } from "@nextui-org/react";
import Information from "./Information";
import ChangePassword from "./ChangePassword";
import User from "@/types/user";

interface ProfileComponentProps {
    user: User;
}

export default function ProfileComponent({ user }: ProfileComponentProps) {

    // const user = {
    //     id: "weidak",
    //     name: "Weida",
    //     email: "weida.tay@u.nus.edu",
    //     gender: "Male",
    //     image: "https://media.licdn.com/dms/image/D5603AQFsY4zA-klqEg/profile-displayphoto-shrink_800_800/0/1687610119782?e=1700092800&v=beta&t=pK6DH64cwnJKzPy4SRvNcjZLvM60Z9DJylAr82Hz5XY",
    //     bio: "Aspiring software engineer.",
    //     createdOn: new Date('2023-09-01T00:00:00.000Z'),
    // }

    // States
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    // Flags
    const [isChangePassword, setIsChangePassword] = useState(false);

    return (
        <div className="flex items-center align-middle justify-center h-screen">
            <Card className="flex w-unit-8xl">
                <CardHeader className="justify-center">
                    <ProfileCard name={user.name} email={user.email} image={user.image}/>
                </CardHeader>
                <CardBody className="justify-center space-y-5">
                    { isChangePassword ? (
                        <ChangePassword setIsChangePassword={setIsChangePassword}/>
                    ) : (
                        <Information setIsChangePassword={setIsChangePassword}/>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}