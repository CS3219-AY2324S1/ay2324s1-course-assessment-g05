import { ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Icons } from "../common/Icons";

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
                <Icons.FiUserX className="w-24 h-24  text-danger" />
                <p>Unable to find a match.</p>
                <p>Please try again later.</p>
            </ModalBody>
            <ModalFooter>
                <Button onPress={onClose} startContent={<Icons.FiX/>}>Cancel</Button>
                <Button onPress={onRetry} startContent={<Icons.RxReset/>} color="primary">Retry</Button>
            </ModalFooter>
        </>
    )
}