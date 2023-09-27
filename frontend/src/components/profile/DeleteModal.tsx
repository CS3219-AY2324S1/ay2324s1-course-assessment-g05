"use client"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { UserService } from "@/helpers/user/user_api_wrappers";
import { PeerPrepErrors } from "@/types/PeerPrepErrors";
import displayToast from "../common/Toast";
import { ToastType } from "@/types/enums";
import { useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "@/common/constants";

interface DeleteModalProps {
    userid: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function DeleteModal({ userid, isOpen, onClose }: DeleteModalProps) {

    const router = useRouter()

    const handleDeleteUser = async () => {
        try {
            let res = await UserService.deleteUser(userid);
            displayToast("User deleted successfully", ToastType.SUCCESS);
            router.push(CLIENT_ROUTES.LOGIN); // Push user to login/sign-up again
            // TODO: Need to clear authentication context here
        } catch (error) {
            displayToast("Something went wrong, please try again later.", ToastType.ERROR)
        }
    }

    return (
        <>
            <Modal
                size="xs"
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalHeader>
                            Delete User
                        </ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to delete this user? This action is irreversible.</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                className="bg-red-700"
                                onClick={() => {
                                    handleDeleteUser();
                                    onClose();
                                }}
                            >
                                Confirm
                            </Button>
                        </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}