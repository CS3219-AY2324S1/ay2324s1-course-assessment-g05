import { Input, Button, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Spacer } from "@nextui-org/react";
import User from "@/types/user";
import { FormEvent, useState } from "react";

interface InformationProps {
    user: User;
    setIsChangePassword: (isChangePassword: boolean) => void;
    saveInformation: (e: FormEvent<HTMLFormElement>, updatedUser: User) => void;
}

export default function Information({user, setIsChangePassword, saveInformation}: InformationProps) {

    const [name, setName] = useState<String>(user.name);
    const [bio, setBio] = useState<String>(user.bio);
    const [gender, setGender] = useState(user.gender ? user.gender : "");

    const genders: {[key: string]: string} = { 
        "MALE": "Male", 
        "FEMALE": "Female", 
        "": "Prefer not to say"
    }

    const handleGenderChange = (value: string) => {
        setGender(value);
        console.log("User info: " + JSON.stringify(user));
    }


    let updatedUser: User = {
        name: name,
        email: user.email,
        bio: bio ? bio : undefined,
        role: user.role,
        gender: gender === "Prefer not to say" ? undefined : gender,
    }


    return (
    <div>
        <header className="justify-center text-m underline">Edit your information:</header>
        <Spacer y={4}/>
        <form className="justify-center max-w-xl space-y-4" onSubmit={(e) => {saveInformation(e, updatedUser)}}>
            <Input
                isRequired
                label="Name"
                isClearable
                defaultValue={user.name}
                onInput={(e) => {setName(e.currentTarget.value)}}
            />
            <Input
                label="Bio"
                isClearable
                maxLength={50}
                defaultValue={user.bio}
                onInput={(e) => {setBio(e.currentTarget.value)}}
            />
            <div className="flex flex-row space-x-5 items-center">
                <p>Gender:</p>
                <Dropdown>
                    <DropdownTrigger>
                        <Button 
                        variant="bordered" 
                        >
                        {genders[gender]}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Gender" onAction={(key) => handleGenderChange(String(key))}>
                        <DropdownItem
                            key="MALE"
                            color={"default"}
                            className={""}
                        >
                            Male
                        </DropdownItem>
                        <DropdownItem
                            key="FEMALE"
                            color={"default"}
                            className={""}
                        >
                            Female
                        </DropdownItem>
                        <DropdownItem
                            key=""
                            color={"default"}
                            className={""}
                        >
                            Prefer not to say
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div className="flex flex-row justify-between">
                <Link className="cursor-pointer" onClick={() => {setIsChangePassword(true)}}>Change password</Link>
                <Button type="submit" color="primary">
                    Save
                </Button>
            </div>
        </form>
    </div>
    )
}