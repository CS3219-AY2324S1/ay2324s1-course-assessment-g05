import { Input, Button, Link, Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface ChangePasswordProps {
    setIsChangePassword: (isChangePassword: boolean) => void;
}

export default function ChangePassword({setIsChangePassword}: ChangePasswordProps) {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [arePasswordsEqual, setArePasswordsEqual] = useState(false);
    const [isPasswordDifferent, setIsPasswordDifferent] = useState(false);

    useEffect(() => {
        setArePasswordsEqual((newPassword == confirmNewPassword));
        setIsPasswordDifferent(oldPassword === "" ? true : (oldPassword !== newPassword));
    }, [oldPassword, newPassword, confirmNewPassword])

    return (
        <div>
            <form className="justify-center max-w-xl space-y-4">
                <Input 
                    variant="bordered"
                    type="password"
                    label="Old password" 
                    onInput={(e) => {
                        setOldPassword(e.currentTarget.value);
                    }}
                />
                <Input 
                    variant="bordered"
                    type="password"
                    label="New password" 
                    onInput={(e) => {
                        setNewPassword(e.currentTarget.value);
                    }}
                />
                <Input 
                    variant="bordered"
                    type="password"
                    label="Re-enter new password" 
                    onInput={(e) => {
                        setConfirmNewPassword(e.currentTarget.value);
                    }}
                />
                { arePasswordsEqual ? (<Spacer y={8}/>) : (<div className="text-center text-xs font-bold text-red-500">New passwords do not match</div>)}
                { isPasswordDifferent ? (<Spacer y={8}/>) : (<div className="text-center text-xs font-bold text-red-500">Old and new passwords cannot be the same</div>)}
                <div className="flex flex-row justify-between">
                    <Link className="cursor-pointer" onClick={() => {setIsChangePassword(false)}}>Edit information</Link>
                    <Button type="submit" color="primary">
                        Confirm
                    </Button>
                </div>
            </form>
        </div>
    )
}