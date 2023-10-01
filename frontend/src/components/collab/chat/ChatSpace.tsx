"use client";
import { useRef, useState } from "react";
import ChatBubble from "./ChatBubble";
import { BsSendFill } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { Button, Divider } from "@nextui-org/react";
import User from "@/types/user";
import CodeEditorNavBarTooltip from "../CodeEditorNavBarTooltip";
import ProfilePictureAvatar from "@/components/common/ProfilePictureAvatar";

interface IChatSpaceProps {
  onClose: () => void;
  partner: User;
}

const ChatSpace = ({ onClose, partner }: IChatSpaceProps) => {
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const intialMesages = [
    {
      role: "user",
      content: "Hello!!!",
    },
    {
      role: "other",
      content: "Hi..?",
    },
  ];
  const [messages, setMessages] = useState(intialMesages);

  const handleSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = e.currentTarget.message.value;
    if (!message) {
      return;
    }

    setMessages([...messages, { role: "user", content: message }]);
    e.currentTarget.message.value = "";
    setTimeout(() => {
      scrollTargetRef!.current!.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className={`bg-black rounded-xl w-[400px] p-2`}>
      <div className="flex w-full justify-between mb-2">
        <div className="flex items-center gap-2">
          <ProfilePictureAvatar profileUrl={partner.image!} size="8" />

          <span className="font-semibold text-sm"> {partner.name} </span>
        </div>
        <Button isIconOnly variant="light" onPress={onClose}>
          <RxCross2 />
        </Button>
      </div>
      <Divider />
      <div className=" py-8 text-base leading-7 text-gray-600 h-[400px] overflow-y-auto">
        <ul className="space-y-3 px-4">
          {messages.map((item, idx) => (
            <ChatBubble
              id={idx}
              message={item.content}
              isSelf={item.role === "user"}
            />
          ))}
        </ul>
        <div ref={scrollTargetRef}></div>
      </div>
      <form
        onSubmit={handleSubmitMessage}
        className="p-4 flex gap-2 text-base font-semibold leading-7"
      >
        <input
          id="message"
          placeholder="Message"
          autoComplete="off"
          className="px-2 py-2  rounded-md flex-1 font-light text-sm focus:outline-none focus:bg-zinc-800"
        />
        <button className="bg-yellow px-2.5 rounded-md text-black hover:bg-amber-200  active:bg-white">
          <BsSendFill />
        </button>
      </form>
    </div>
  );
};

export default ChatSpace;
