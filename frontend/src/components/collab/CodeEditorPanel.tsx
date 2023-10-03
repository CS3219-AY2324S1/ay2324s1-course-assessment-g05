import { FC, SetStateAction, useEffect, useRef, useState } from "react";
import User from "@/types/user";
import CodeEditorNavbar from "./CodeEditorNavbar";
import { Divider } from "@nextui-org/react";
import CodeEditor from "./CodeEditor";
import { getCodeTemplate } from "@/utils/defaultCodeUtils";
import SocketService from "@/helpers/collaboration/socket_service";
import { getCollaborationSocketConfig } from "@/helpers/collaboration/collaboration_api_wrappers";

interface CodeEditorPanelProps {
  partner: User;
  language: string;
  questionTitle: string;
  roomId: string;
  socketService?: SocketService;
  isSocketConnected: boolean;
}

const CodeEditorPanel: FC<CodeEditorPanelProps> = ({
  partner,
  language,
  questionTitle,
  roomId,
  socketService,
  isSocketConnected,
}) => {
  const editorRef = useRef(null);

  const [currentCode, setCurrentCode] = useState<string>(
    getCodeTemplate(language, questionTitle)
  );

  useEffect(() => {
    socketService && socketService.receiveCodeUpdate(setCurrentCode);
  }, [socketService]);

  const handleEditorChange = (currentContent: string | undefined) => {
    if (!currentContent) return;
    setCurrentCode(currentContent!);
    socketService && socketService.sendCodeChange(currentContent!);
  };

  const handleEditorDidMount = async (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  const handleResetToDefaultCode = () => {
    setCurrentCode(getCodeTemplate(language, questionTitle));
    socketService &&
      socketService.sendCodeChange(getCodeTemplate(language, questionTitle));
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
