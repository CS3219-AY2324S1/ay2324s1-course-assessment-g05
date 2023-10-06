import { ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Icons } from "../common/Icons";


export default function MatchingLobbyErrorView(
    {
        onClose
    }: {
        onClose: () => void
    }
) {
    return (
        <>
            <ModalBody className="flex flex-col gap-2 p-4 h-full items-center justify-center mt-10">
                <Icons.FiWifiOff className="w-24 h-24  text-danger" />
                <p>Connection lost!</p>
                <p>Please try again later.</p>
            </ModalBody>
            <ModalFooter>
                <Button onPress={onClose}>Ok</Button>
            </ModalFooter>
        </>
    )
}