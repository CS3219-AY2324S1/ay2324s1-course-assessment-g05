import { getCollaborationSocketConfig } from "@/helpers/collaboration/collaboration_api_wrappers";
import SocketService from "@/helpers/collaboration/socket_service";
import { getQuestionById } from "@/helpers/question/question_api_wrappers";
import { UserService } from "@/helpers/user/user_api_wrappers";
import Question from "@/types/question";
import User from "@/types/user";
import { notFound } from "next/navigation";
import { createContext, useContext, useRef, useState } from "react";
import { useAuthContext } from "./auth";

interface ICollabContext {
  handleConnectToRoom: (roomId: string) => Promise<void>;
  initializeSocket: (roomId: string) => Promise<void>;
  handleDisconnectFromRoom: () => void;
  isLoading: boolean;
  socketService: SocketService | undefined;
  isSocketConnected: boolean;
  roomId: string;
  partner: User | undefined;
  user: User | undefined;
  question: Question | undefined;
  matchedLanguage: string;
}

interface ICollabProvider {
  children: React.ReactNode;
}

const CollabContext = createContext<ICollabContext>({
  handleConnectToRoom: async (roomId: string) => {},
  initializeSocket: async (roomId: string) => {},
  handleDisconnectFromRoom: () => {},
  isLoading: false,
  socketService: undefined,
  isSocketConnected: false,
  roomId: "",
  partner: undefined,
  user: undefined,
  question: undefined,
  matchedLanguage: "",
});

const useCollabContext = () => useContext(CollabContext);

const CollabProvider = ({ children }: ICollabProvider) => {
  const { user } = useAuthContext();
  const [socketService, setSocketService] = useState<SocketService>();
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [partner, setPartner] = useState<User>();
  const [question, setQuestion] = useState<Question>();
  const [matchedLanguage, setMatchedLanguage] = useState<string>("");

  const initializeSocket = async (roomId: string) => {
    setRoomId(roomId);

    const config = await getCollaborationSocketConfig();
    const newSocket = new SocketService(roomId, config.endpoint, config.path);
    setSocketService(newSocket);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const isConnected = newSocket.getConnectionStatus();
      setIsSocketConnected(isConnected);
      if (!isConnected) {
        newSocket.joinRoom(); // Ensures that socket attempts to rejoin the room if it disconnects
      }
    }, 500);
  };

  const handleConnectToRoom = async (roomId: string) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      // TODO: update this when matching service is available
      // check if a match is established => at least a partner, a question, and a room id is returned
      const { secondUserId, questionId, matchedLanguage } =
        MatchingService.getMatchedRecord({
          firstUserId: user.id ?? "cln1l7jer0000t2ykbb11njys",
          secondUserId: "cln1arksi00007k9wxqsyxpzv",
          questionId: "650a5979bf32dcb1ae15bf11",
          matchedLanguage: "javascript",
        });

      if (!matchedLanguage) {
        return notFound();
      }

      setMatchedLanguage(matchedLanguage);

      // TODO: refactor this to Promise.all

      const partner = await UserService.getUserById(secondUserId);

      if (!partner) {
        return notFound();
      }

      setPartner(partner);

      const question = (await getQuestionById(questionId)) as Question;

      if (!question) {
        return notFound();
      }

      setQuestion(question);
      await initializeSocket(roomId);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectFromRoom = () => {
    // Leave room
    if (socketService) {
      socketService.leaveRoom();
      setSocketService(undefined);
    }
    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const context = {
    handleConnectToRoom,
    initializeSocket,
    handleDisconnectFromRoom,
    isLoading,
    socketService,
    isSocketConnected,
    roomId,
    partner,
    user,
    question,
    matchedLanguage,
  };

  return (
    <CollabContext.Provider value={context}>{children}</CollabContext.Provider>
  );
};

export { useCollabContext, CollabProvider };
