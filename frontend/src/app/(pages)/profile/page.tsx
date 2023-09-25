"use client"
import ProfileComponent from "@/components/profile/Profile"
import { UserService } from "@/helpers/user/user_api_wrappers";
import User from "@/types/user";
import { Metadata } from "next"
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const metadata: Metadata = {
    title: "Profile",
    description: "profile information",
}

export default async function ProfilePage() {

    const [user, setUser] = useState<User | undefined>(undefined);

    const email = typeof window !== "undefined" ? sessionStorage.getItem("email") || "" : "";

    useEffect(() => {
        fetchUser();
    }, [])

    const fetchUser = async () => {
        const rawUser = await UserService.getUserByEmail(email);
        setUser(rawUser);
    }

    async function saveInformation(e: FormEvent<HTMLFormElement>, updatedUser: User, preferences: Preference) {
        e.preventDefault();
        try {
            // Redundant error handling for typescript to stop error
            if (!user) {
                throw new Error("User not retrieved");
            }

            let resPref = await UserService.updateUserPreference(user.id, preferences);
            let res = await UserService.updateUser(user.id, updatedUser);
            toast.success("Information updated successfully.", {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "dark"
              })
        } catch (error) {
            toast.error("Something went wrong. Please refresh and try again.", {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "dark"
              })
        }
    }
  
    return (
        <> 
            { user && <ProfileComponent user={user} saveInformation={saveInformation}/> }        
        </>
    )
}