"use client"
import { getLogger } from "@/helpers/logger";
import { getMatchingSocket } from "@/helpers/matching/matching_api_wrappers";
import { useAuthContext } from "@/providers/auth";
import Partner from "@/types/partner";
import {
  Modal,
  ModalContent
} from "@nextui-org/react";
import React from "react";
import { Socket, io } from 'socket.io-client';
import MatchingLobbyErrorView from "./MatchingLobbyErrorView";
import MatchingLobbyMatchingView from "./MatchingLobbyMatchingView";
import MatchingLobbyNoMatchView from "./MatchingLobbyNoMatchView";
import MatchingLobbySuccessView, { MatchingSuccessState } from "./MatchingLobbySuccessView";

enum MATCHING_STAGE {
  INITIAL,  // To establish socket connection
  MATCHING, // Send request to join queue, wait for update
  SUCCESS,  // Partner found, waiting to start
  FAIL,     // Exceed time limit for matching
  ERROR,    // Error with matching service
}

export default function MatchingLobby({
  isOpen,
  onClose,
  options = {
    languages: [],
    difficulties: [],
    topics: [],
  }
}: {
  isOpen: boolean,
  onClose: () => void,
  options: {
    languages: string[],
    difficulties: string[],
    topics: string[],
  }
}) {
  const initialSuccessState: MatchingSuccessState = {
    userReady: false,
    partnerReady: false,
    partnerLeft: false,
    partner: {
      id: "",
      name: "",
      image: undefined
    }
  }

  const [stage, setStage] = React.useState(MATCHING_STAGE.INITIAL);
  const [successState, setSuccessState] = React.useState(initialSuccessState);

  const [socket, setSocket] = React.useState<Socket>();
  const { user } = useAuthContext();

  const logger = getLogger('matching');

  /////////////////////////////////////////////
  // Stage fired events
  /////////////////////////////////////////////
  const initializeSocket = async () => {
    try {
      const config = await getMatchingSocket();
      const socket = io(config.endpoint, { path: config.path });

      // Register server events
      socket.on('connect', () => setStage(MATCHING_STAGE.MATCHING));
      socket.on("disconnect", () => setStage(MATCHING_STAGE.ERROR));
      socket.on("connect_error", () => setStage(MATCHING_STAGE.ERROR));
      socket.on("matched", handleMatched);
      socket.on("no_match", handleNoMatch);
      socket.on("room_closed", handleRoomClosed);
      socket.on("peer_ready_change", handlePartnerReadyChange);

      setSocket(socket);
    } catch (error) {
      logger.error(error);
      setStage(MATCHING_STAGE.ERROR)
    }
  }

  const onMatchingStage = () => {
    try {
      setSuccessState(initialSuccessState);
      socket?.emit("request_match", {
        user: {
          id: user.id,
          name: user.name,
          image: user.image
        },
        preferences: options
      });
    } catch (error) {
      logger.error(error);
      setStage(MATCHING_STAGE.ERROR);
    }
  }

  /////////////////////////////////////////////
  // Server fired events
  /////////////////////////////////////////////
  const handleMatched = (res: {
    room: string,
    partner: Partner
  }) => {
    setSuccessState(prev => ({
      ...prev,
      partner: res.partner
    }));

    setStage(MATCHING_STAGE.SUCCESS);
  }

  const handleRoomClosed = () => setSuccessState(prev => ({
    ...prev,
    partnerLeft: true
  }));

  const handleNoMatch = () => setStage(MATCHING_STAGE.FAIL);

  const handlePartnerReadyChange = (ready: boolean) => setSuccessState(prev => ({
    ...prev,
    partnerReady: ready
  }))


  /////////////////////////////////////////////
  // User fired events
  /////////////////////////////////////////////
  const notifyUserReady = (ready: boolean) => {
    setSuccessState(prev => ({
      ...prev,
      userReady: ready
    }))
    socket?.emit('update_ready', ready);
  }

  const handleClose = () => {
    logger.info("Cancel matching")
    socket?.disconnect();
    onClose();
  }

  const handleRetry = () => setStage(MATCHING_STAGE.MATCHING);

  const notifyStart = () => {
    // TODO: link with collab
    logger.debug("notify start");
  }

  /////////////////////////////////////////////
  // Modal views
  /////////////////////////////////////////////

  const renderView = (stage: MATCHING_STAGE) => {
    switch (stage) {
      case MATCHING_STAGE.INITIAL:
        return <></>
      case MATCHING_STAGE.MATCHING:
        return <MatchingLobbyMatchingView onClose={handleClose} preference={options} />;
      case MATCHING_STAGE.SUCCESS:
        return <MatchingLobbySuccessView
          state={successState}
          notifyUserReady={notifyUserReady}
          notifyStartCollab={notifyStart}
          cancel={handleClose}
          rematch={() => setStage(MATCHING_STAGE.MATCHING)} />;
      case MATCHING_STAGE.FAIL:
        return <MatchingLobbyNoMatchView onClose={handleClose} onRetry={handleRetry} />;
      default:
        return <MatchingLobbyErrorView onClose={handleClose} />;
    }
  }

  /////////////////////////////////////////////
  // React hooks
  /////////////////////////////////////////////
  React.useEffect(() => {
    if (isOpen) {
      switch (stage) {
        case MATCHING_STAGE.INITIAL:
          initializeSocket();
          break;
        case MATCHING_STAGE.MATCHING:
          onMatchingStage();
          break;
        default:
          break;
      }
    } else {
      setStage(MATCHING_STAGE.INITIAL);
    }
  }, [isOpen, stage])

  return (
    <>
      <Modal
        isOpen={isOpen}
        isDismissable={false}
        hideCloseButton
        size="md"
        classNames={{
          base: "h-fit",
          body: "p-4",
          footer: "p-4"
        }}
      >
        <ModalContent>
          {() => (
            <>
              {renderView(stage)}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}