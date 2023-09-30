import { ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { FiUserX } from "react-icons/fi";

export default function MatchingLobbyNoMatchView(
    {
        onRetry,
        onClose
    }: {
        onRetry: () => void
        onClose: () => void
    }
) {
    return (
        <>
            <ModalBody className="flex flex-col gap-2 p-4 h-full items-center justify-center my-10">
                <FiUserX className="w-24 h-24  text-danger" />
                <p>Unable to find a match.</p>
                <p>Please try again later.</p>
            </ModalBody>
            <ModalFooter>
                <Button onPress={onClose}>Cancel</Button>
                <Button onPress={onRetry} color="primary">Retry</Button>
            </ModalFooter>
        </>
    )
}