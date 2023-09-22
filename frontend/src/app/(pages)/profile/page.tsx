import ProfileComponent from "@/components/profile/Profile"
import { getUser } from "@/helpers/user/user_api_wrappers";
import User from "@/types/user";
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Profile",
    description: "profile information",
}

export default async function ProfilePage() {
    const user: User | null = await getUser("userid"); // Placeholder
    return (
        <>
            <ProfileComponent user={user}/>
        </>
    )
}