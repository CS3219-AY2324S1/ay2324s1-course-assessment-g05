import { ModalBody, ModalFooter, Button, CircularProgress } from "@nextui-org/react";
import { FiWifiOff } from "react-icons/fi";
import ComplexityChip from "../question/ComplexityChip";
import React from "react";
import Preference from "@/types/preference";

export default function MatchingLobbyMatchingView(
    {
        onClose,
        preference
    }: {
        onClose: () => void
        preference: Preference
    }
) {
    const [timer, setTimer] = React.useState(0);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTimer(prev => prev + 1);
        }, 1000)

        return () => clearTimeout(timer)
    }, [timer])


    return (
        <>
            <ModalBody className="flex flex-col gap-2 p-4 h-full items-center justify-center my-5">
                <CircularProgress
                    classNames={{
                        svg: "w-24 h-24"
                    }}
                    label={"Looking for a peer... " + timer}>
                </CircularProgress>
                <div className="flex flex-col gap-2 items-center text-small">
                    <span>{preference.languages.join(", ")}</span>
                    <span className="flex gap-2">
                        {preference.difficulties.map(item => (
                            <ComplexityChip key={item} complexity={item} size="sm"></ComplexityChip>
                        ))}
                    </span>
                    <span className="truncate">{preference.topics.join(", ")}</span>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onPress={onClose}>Cancel</Button>
            </ModalFooter>
        </>
    )
}
