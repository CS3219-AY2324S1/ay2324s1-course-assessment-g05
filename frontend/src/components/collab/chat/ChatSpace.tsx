"use client";
import { useRef, useState } from "react";
import { Icons } from "../../common/Icons";
import ChatBubble from "./ChatBubble";

const ChatSpace = () => {
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
    <div className={`bg-black rounded-xl max-w-[400px] p-5`}>
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
          className="px-2 py-2  rounded-md flex-1 font-light text-sm focus:outline-none focus:bg-zinc-800"
        />
        <button className="bg-yellow px-2.5 rounded-md text-black active:bg-white">
          <Icons.BsSendFill />
        </button>
      </form>
    </div>
  );
};

export default ChatSpace;
