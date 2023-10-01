import { Button, Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import { BsChatSquareDotsFill } from "react-icons/bs";
import ChatSpace from "./ChatSpace";
import { useState } from "react";
import User from "@/types/user";

const ChatSpaceToggle = ({ partner }: { partner: User }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = () => setIsOpen(!isOpen);

  const onClose = () => setIsOpen(false);

  return (
    <div className="absolute right-6 bottom-6">
      <div style={{ display: isOpen ? "block" : "none" }}>
        <ChatSpace onClose={onClose} partner={partner} />
      </div>
      <div className="flex w-full justify-end mt-3">
        <Button
          isIconOnly
          className="rounded-full bg-yellow hover:bg-amber-200 active:bg-white"
          size="lg"
          onPress={onToggle}
        >
          <BsChatSquareDotsFill className="text-xl text-black" />
        </Button>
      </div>
    </div>
  );
};

export default ChatSpaceToggle;
