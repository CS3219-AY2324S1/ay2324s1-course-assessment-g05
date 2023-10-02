import { FC, SetStateAction, useEffect, useRef, useState } from "react";
import User from "@/types/user";
import CodeEditorNavbar from "./CodeEditorNavbar";
import { Divider } from "@nextui-org/react";
import CodeEditor from "./CodeEditor";
import { getCodeTemplate } from "@/utils/defaultCodeUtils";
import SocketService from "@/helpers/collaboration/socket_service"
import { getCollaborationSocketConfig } from "@/helpers/collaboration/collaboration_api_wrappers";

interface CodeEditorPanelProps {
  partner: User;
  language: string;
  questionTitle: string;
  roomId: string;
}

const CodeEditorPanel: FC<CodeEditorPanelProps> = ({
  partner,
  language,
  questionTitle,
  roomId
}) => {

  const [socketService, setSocketService] = useState<SocketService | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const editorRef = useRef(null);

  const [currentCode, setCurrentCode] = useState<string>(
    getCodeTemplate(language, questionTitle) 
  );

  useEffect(() => {
    if (socketService) {
      socketService.receiveCodeUpdate(setCurrentCode);
      if (!isSocketConnected) {
        socketService.joinRoom(); // Ensures that socket attempts to rejoin the room if it disconnects
      }
    }
  });

  setInterval(() => {
    if (socketService) {
      setIsSocketConnected(socketService.getConnectionStatus());
    }
  }, 500)

  const initializeSocket = async () => {
    const config = await getCollaborationSocketConfig();
    setSocketService(new SocketService(roomId, config.endpoint, config.path));
  }

  const handleEditorChange = (currentContent: string | undefined) => {
    if (!currentContent) return;
    setCurrentCode(currentContent!);
    if (socketService) socketService.sendCodeChange(currentContent!);
  };

  const handleEditorDidMount = async (editor: any, monaco: any) => {
    editorRef.current = editor;
    await initializeSocket();
  }

  const handleResetToDefaultCode = () => {
    setCurrentCode(getCodeTemplate(language, questionTitle));
    if (socketService) socketService.sendCodeChange(getCodeTemplate(language, questionTitle));
  };

  return (
    <div>
      <CodeEditorNavbar
        partner={partner!}
        language={language}
        roomId={roomId}
        handleResetToDefaultCode={handleResetToDefaultCode}
        isSocketConnected={isSocketConnected}
      />
      <Divider className="space-y-2" />
      <CodeEditor
        language={language}
        currentCode={currentCode}
        handleEditorChange={handleEditorChange}
        handleEditorDidMount={handleEditorDidMount}
      />
    </div>
  );
};

export default CodeEditorPanel;
