import SocketService from "@/helpers/matching/socket_service";
import { CircularProgress, ModalBody } from "@nextui-org/react";
import { useEffect } from "react";

export default function MatchingLobbyPrepCollabView() {

    useEffect(() => {
        async function initializeSocket() {
            await SocketService.getInstance().then(socket => {
                console.log(socket.getRoomPreference());
                // contact question service
            })

        }
        initializeSocket();
    }, [])

    return (
        <>
            <ModalBody className="flex flex-col gap-2 p-4 h-full items-center justify-center my-5">
                <CircularProgress
                    classNames={{
                        svg: "w-24 h-24"
                    }}>
                </CircularProgress>
            </ModalBody>
        </>
    )
}