"use client"
import ProfileComponent from "@/components/profile/Profile"
import { UserService } from "@/helpers/user/user_api_wrappers";
import { useAuthContext } from "@/providers/auth";
import { Role } from "@/types/enums";
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
        console.log("User retrieved: " + JSON.stringify(rawUser));
        setUser(rawUser);
    }
    

    async function saveInformation(e: FormEvent<HTMLFormElement>, updatedUser: User) {
        e.preventDefault();
        try {
            // Redundant error handling for typescript to stop error
            if (!user) {
                throw new Error("User not retrieved");
            }

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
            console.log("Profile: Save error: " + error);
            toast.error("Something went wrong. Please refresh and try again.", {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "dark"
              })
        } finally {
            //cleanup if necessary
        }
    }
  
    return (
        <> 
            { user && <ProfileComponent user={user} saveInformation={saveInformation}/> }        
        </>
    )
}