import { Input, Button, Link } from "@nextui-org/react";
import { getUser } from "@/helpers/user/user_api_wrappers";

interface InformationProps {
    setIsChangePassword: (isChangePassword: boolean) => void;
}

export default function Information({setIsChangePassword}: InformationProps) {


    return (
    <div>
        <header className="justify-center text-m underline">Edit your information:</header>
        <form className="justify-center max-w-xl space-y-4">
            <Input
                label="PeerPrep id"
                variant="underlined"
                isClearable
            />
            <Input
                label="Name"
                variant="underlined"
                isClearable
            />
            <Input
                label="Email"
                variant="underlined"
                isClearable
            />
            <Input
                label="Bio"
                variant="underlined"
                isClearable
                maxLength={50}
            />
            <Input
                label="Gender"
                variant="underlined"
                isClearable
            />
            <div className="flex flex-row justify-between">
                <Link className="cursor-pointer" onClick={() => {setIsChangePassword(true)}} >Change password</Link>
                <Button type="submit" color="primary">
                    Save
                </Button>
            </div>
        </form>
    </div>
    )
}