import ChatMessage from "@/types/chat_message";
import { useEffect, useState } from "react";

interface ChatBubbleProps {
    message: ChatMessage;
    isSelf: boolean;
}

const ChatBubble = ({ message, isSelf }: ChatBubbleProps) => {
    const [isSlashAI, setIsSlashAI] = useState(false);

    useEffect(() => {
        if (message.content.startsWith("/ai")) setIsSlashAI(true);
    }, []);

    return (
        <li className={`flex items-center ${isSelf ? "ml-10 justify-end" : "mr-10"}`}>
            <p
                className={`${
                    message.isAIMessage
                        ? "bg-blue text-black text-sm"
                        : isSelf
                        ? "bg-yellow text-black text-sm"
                        : "bg-zinc-800 text-white text-sm"
                } p-2 rounded-md`}
            >
                {message.isAIMessage && (
                    <p className={"font-bold"}> The following message is generated by AI: </p>
                )}
                {isSlashAI ? (
                    <p>
                        <span className="underline">/ai</span>
                        {` ${message.content.substring(4)}`}
                    </p>
                ) : (
                    <>{message.content}</>
                )}
            </p>
        </li>
    );
};

export default ChatBubble;
