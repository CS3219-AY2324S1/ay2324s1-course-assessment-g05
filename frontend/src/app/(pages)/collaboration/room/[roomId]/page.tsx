"use client";

import Workspace from "@/components/collab/Workspace";
import { FC, useEffect, useState } from "react";
import { useCollabContext } from "@/contexts/collab";
import LogoLoadingComponent from "@/components/common/LogoLoadingComponent";
import ChatSpaceToggle from "@/components/collab/chat/ChatSpaceToggle";
import { notFound, useSearchParams } from "next/navigation";

interface pageProps {
  params: {
    roomId: string;
  };
}

const page = ({ params: { roomId } }: pageProps) => {
  const searchParams = useSearchParams();
  const partnerId = searchParams.get("partnerId")!;
  const questionId = searchParams.get("questionId")!;
  const language = searchParams.get("language")!;
  const [roomNotFound, setRoomNotFound] = useState(false);

  const {
    socketService,
    handleConnectToRoom,
    handleDisconnectFromRoom,
    isLoading,
    isNotFoundError,
  } = useCollabContext();

  const handleBeforeUnload = (e: { returnValue: string; }) => {
    if (socketService) {
      e.returnValue = 'Are you sure you want to navigate out of this page?';
    }
  };

  useEffect(() => {
    if (!socketService) {
      handleConnectToRoom(roomId, questionId, partnerId, language);
    }

    if (socketService) socketService?.receiveRoomNotFound(setRoomNotFound);

    if (isNotFoundError || roomNotFound) {
      console.log("EROR");
      return notFound();
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {

      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      console.log("Running handleDisconnectFromRoom");
      if (socketService) {
        handleDisconnectFromRoom();
      }

    };
  }, [socketService, roomNotFound]);

  return (
    <div>
      {isLoading && !socketService ? (
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
