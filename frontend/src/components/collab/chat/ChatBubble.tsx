interface ChatBubbleProps {
  id: number;
  message: string;
  isSelf: boolean;
}

const ChatBubble = ({ id, message, isSelf }: ChatBubbleProps) => {
  return (
    <li
      key={id}
      className={`flex items-center ${isSelf ? "ml-10 justify-end" : "mr-10"}`}
    >
      <p
        className={`${
          isSelf ? "bg-yellow text-black" : "bg-zinc-800 text-white text-sm"
        } p-2 rounded-md`}
      >
        {message}
      </p>
    </li>
  );
};

export default ChatBubble;
