"use client";

import Workspace from "@/components/collab/Workspace";
import { FC, useEffect } from "react";
import { useCollabContext } from "@/contexts/collab";
import LogoLoadingComponent from "@/components/common/LogoLoadingComponent";
import ChatSpaceToggle from "@/components/collab/chat/ChatSpaceToggle";

interface pageProps {
  params: {
    roomId: string;
  };
}

const page: FC<pageProps> = ({ params: { roomId } }) => {
  const { handleConnectToRoom, handleDisconnectFromRoom, isLoading } =
    useCollabContext();

  useEffect(() => {
    handleConnectToRoom(roomId);
    return () => {
      console.log("disconnecting from room");
      handleDisconnectFromRoom();
    };
  }, []);

  // FE requirements:
  // TODO: create a chat button that will open the chat panel when clicked

  return (
    <div>
      {isLoading ? (
        <LogoLoadingComponent />
      ) : (
        <>
          <Workspace />
          <ChatSpaceToggle />
        </>
      )}
    </div>
  );
};

export default page;
