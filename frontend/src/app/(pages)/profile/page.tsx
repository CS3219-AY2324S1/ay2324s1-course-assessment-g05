"use client"
import ProfileComponent from "@/components/profile/Profile"
import { UserService } from "@/helpers/user/user_api_wrappers";
import User from "@/types/user";
import { useEffect, useState } from "react";

export default function ProfilePage() {

    const [user, setUser] = useState<User | undefined>(undefined);

    const email = typeof window !== "undefined" ? sessionStorage.getItem("email") || "" : "";

    useEffect(() => {
        fetchUser();
    }, [])

    const fetchUser = async () => {
        const rawUser = await UserService.getUserByEmail(email);
        setUser(rawUser);
    }
  
    return (
        <> 
            { user && <ProfileComponent user={user} /> }        
        </>
    )
}