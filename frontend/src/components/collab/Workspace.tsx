import { FC, useEffect, useRef, useState } from "react";
import Split from "react-split";
import ProblemPanel from "./ProblemPanel";
import CodeEditorPanel from "./CodeEditorPanel";
import User from "@/types/user";
import Question from "@/types/question";
import SocketService from "@/helpers/collaboration/socket_service";
import { getCollaborationSocketConfig } from "@/helpers/collaboration/collaboration_api_wrappers";

interface WorkspaceProps {
  question: Question;
  partner: User;
  language: string;
  roomId: string;
}

const Workspace: FC<WorkspaceProps> = ({
  question,
  partner,
  language,
  roomId,
}) => {
  const [socketService, setSocketService] = useState<SocketService>();
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  const initializeSocket = async () => {
    if (!socketService) {
      const config = await getCollaborationSocketConfig();
      setSocketService(new SocketService(roomId, config.endpoint, config.path));
    }
  };

  useEffect(() => {
    initializeSocket(); // Initialize socket connection when component mounts

    const intervalId = setInterval(() => {
      if (socketService) {
        const isConnected = socketService.getConnectionStatus();
        setIsSocketConnected(isConnected);
        console.log("Socket connected: ", isConnected);
        if (!isConnected) {
          socketService.joinRoom(); // Ensures that socket attempts to rejoin the room if it disconnects
        }
      }
    }, 500);

    // Cleanup functions
    return () => {
      // Leave room
      if (socketService) {
        socketService.leaveRoom();
      }
      // Clear interval
      clearInterval(intervalId);
    };
  }, [socketService]);

  return (
    <Split className="flex flex-row">
      <ProblemPanel question={question} />
      <CodeEditorPanel
        partner={partner}
        language={language}
        questionTitle={question.title}
        roomId={roomId}
        socketService={socketService}
        isSocketConnected={isSocketConnected}
      />
    </Split>
  );
};

export default Workspace;
