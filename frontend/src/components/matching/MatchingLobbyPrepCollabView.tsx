import SocketService from "@/helpers/matching/socket_service";
import { getQuestionByPreference } from "@/helpers/question/question_api_wrappers";
import { useAuthContext } from "@/contexts/auth";
import { CircularProgress, ModalBody } from "@nextui-org/react";
import { useEffect } from "react";

export default function MatchingLobbyPrepCollabView() {
  const user = useAuthContext();

  useEffect(() => {
    async function initializeSocket() {
      await SocketService.getInstance().then(async (socket) => {
        // contact question service
        const preference = socket.getRoomPreference() ?? user.user.preferences;
        await getQuestionByPreference(preference).then((questionId) => {
          socket.requestStartCollaboration(questionId);
        });
      });
    }
    initializeSocket();
  }, []);

  return (
    <>
      <ModalBody className="flex flex-col gap-2 p-4 h-full items-center justify-center my-5">
        <CircularProgress
          classNames={{
            svg: "w-24 h-24",
          }}
          aria-label="Setting up collaboration session"
        ></CircularProgress>
      </ModalBody>
    </>
  );
}
