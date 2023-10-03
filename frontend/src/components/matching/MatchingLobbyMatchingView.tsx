"use strict"
import { ModalBody, ModalFooter, Button, CircularProgress } from "@nextui-org/react";
import ComplexityChip from "../question/ComplexityChip";
import { useEffect, useState } from "react";
import Preference from "@/types/preference";
import SocketService from "@/helpers/matching/socket_service";
import { useAuthContext } from "@/providers/auth";
import { Icons } from "../common/Icons";

export default function MatchingLobbyMatchingView(
    {
        onMatched,
        onNoMatch,
        onClose,
        onError,
        preference
    }: {
        onMatched: (
            isOwner: boolean
        ) => void
        onNoMatch: () => void
        onClose: () => void
        onError: () => void
        preference: Preference
    }
) {
    const { user } = useAuthContext();
    const [ timer, setTimer] = useState(0);
    const [ sent, setSent ] = useState(false);

    const requestMatch = (socket: SocketService) => {
        try {
            socket.requestMatching({
                user: {
                    id: user.id,
                    name: user.name,
                    image: user.image
                },
                preferences: preference
            });
        } catch (error) {
            console.log(error);
            onError();
        }
    }

    useEffect(() => {
        async function initializeSocket() {
            await SocketService.getInstance().then(socket => {
                socket.onMatched(owner => {
                    onMatched(user.id === owner)
                });
                socket.onNoMatched(onNoMatch);
                console.log(sent);
                
                requestMatch(socket);
            })
        }
        initializeSocket();
    }, [])


    useEffect(() => {
        if (timer > 90) {
            return onNoMatch();
        }
        const clock = setTimeout(() => {
            setTimer(prev => prev + 1);
        }, 1000)

        return () => clearTimeout(clock)
    }, [timer])


    return (
        <>
            <ModalBody className="flex flex-col gap-2 p-4 h-full items-center justify-center my-4">
                <CircularProgress
                    classNames={{
                        svg: "w-24 h-24"
                    }}
                    aria-label="waiting for a match"
                    label={timer + "s"}
                    >
                </CircularProgress>
                <span>Waiting for a match...</span>
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
            <Button onPress={onClose} startContent={<Icons.FiX/>}>Cancel</Button>
            </ModalFooter>
        </>
    )
}
