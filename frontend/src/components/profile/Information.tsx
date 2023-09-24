import { Input, Button, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Spacer, SelectItem, Select } from "@nextui-org/react";
import User from "@/types/user";
import { FormEvent, useEffect, useState } from "react";
import { COMPLEXITY, LANGUAGE, TOPIC } from "@/types/enums";
import { StringUtils } from "@/utils/stringUtils";

interface InformationProps {
    user: User;
    setIsChangePassword: (isChangePassword: boolean) => void;
    saveInformation: (e: FormEvent<HTMLFormElement>, updatedUser: User, preference: Preference) => void;
}

export default function Information({user, setIsChangePassword, saveInformation}: InformationProps) {

    const [name, setName] = useState<String>(user.name);
    const [bio, setBio] = useState<String>(user.bio);
    const [gender, setGender] = useState(user.gender ? user.gender : "");
    const [preferences, setPreferences] = useState(
        user.preferences || { languages: [], difficulties: [], topics: [] }
    );

    const [languagesSelected, setLanguagesSelected] = useState(user.preferences?.languages);
    const [difficultiesSelected, setDifficultiesSelected] = useState(user.preferences?.difficulties);
    const [topicsSelected, setTopicsSelected] = useState(user.preferences?.topics);

    const languageArray = Object.values(LANGUAGE).map((value) => ({
        id: value,
        name: value,
    }));
    const difficultiesArray = Object.values(COMPLEXITY).map((value) => ({
        id: value,
        name: value,
    }));
    const topicArray = Object.values(TOPIC).map((value) => ({
        id: value,
        name: value,
    }));

    const handleOnLanguageChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setLanguagesSelected(event.target.value.split(","));
    }

    const handleOnDifficultyChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setDifficultiesSelected(event.target.value.split(","));
    }

    const handleOnTopicChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setTopicsSelected(event.target.value.split(","));
    }

    useEffect(() => {
        setPreferences({
            languages: languagesSelected ? languagesSelected : [],
            difficulties: difficultiesSelected ? difficultiesSelected : [],
            topics: topicsSelected ? topicsSelected : [],
        })
        console.log(preferences);
    }, [languagesSelected, difficultiesSelected, topicsSelected])

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
        <form className="justify-center max-w-xl space-y-4" onSubmit={(e) => {saveInformation(e, updatedUser, preferences)}}>
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
                        >
                            Male
                        </DropdownItem>
                        <DropdownItem
                            key="FEMALE"
                            color={"default"}
                        >
                            Female
                        </DropdownItem>
                        <DropdownItem
                            key=""
                            color={"default"}
                        >
                            Prefer not to say
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div className={"flex flex-col h-full justify-start gap-4 text-sm overflow-hidden"}>
                <Select
                    name="languages"
                    label="Progamming languages"
                    selectionMode="multiple"
                    placeholder="Select a language"
                    selectedKeys={preferences.languages}
                    onChange={handleOnLanguageChange}
                >
                    {languageArray.map((value) => (
                        <SelectItem key={value.id} value={value.id}>
                            {value.name}
                        </SelectItem>
                    ))}
                </Select>
                <Select
                    name="difficulties"
                    label="Complexity"
                    selectionMode="multiple"
                    placeholder="Select a complexity level"
                    selectedKeys={preferences.difficulties}
                    onChange={handleOnDifficultyChange}
                >
                    {difficultiesArray.map((value) => (
                    <SelectItem key={value.id} value={value.id}>
                        {value.name}
                    </SelectItem>
                    ))}
                </Select>

                <Select
                    name="topics"
                    label="Topics"
                    selectionMode="multiple"
                    placeholder="Select a topic"
                    selectedKeys={preferences.topics}
                    onChange={handleOnTopicChange}
                >
                    {topicArray.map((value) => (
                    <SelectItem key={value.id} value={value.id}>
                        {value.name}
                    </SelectItem>
                    ))}
                </Select>
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