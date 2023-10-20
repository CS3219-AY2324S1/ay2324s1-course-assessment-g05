import { FC, useEffect, useRef, useState } from "react";
import CodeEditorNavbar from "./CodeEditorNavbar";
import { Divider } from "@nextui-org/react";
import CodeEditor from "./CodeEditor";
import { getCodeTemplate } from "@/utils/defaultCodeUtils";

import { useCollabContext } from "@/contexts/collab";
import { notFound } from "next/navigation";
import displayToast from "../common/Toast";
import { ToastType } from "@/types/enums";

const CodeEditorPanel: FC = ({}) => {
  const { matchedLanguage, question, socketService } = useCollabContext();
  if (!socketService) {
    return null;
  }

  const questionTitle = question?.title || "";
  const editorRef = useRef(null);

  const [currentCode, setCurrentCode] = useState<string>(
    getCodeTemplate(matchedLanguage, questionTitle)
  );
  const [isUserNotValid, setIsUserNotValid] = useState<boolean>(false);

  useEffect(() => {
    socketService.receiveCodeUpdate(setCurrentCode);
    socketService.receiveUserNotValid(setIsUserNotValid);
  }, [socketService]);

  useEffect(() => {
    if (isUserNotValid) {
      console.log("EROR");
      notFound();
    }
  }, [isUserNotValid]);

  const handleEditorChange = (currentContent: string | undefined) => {
    if (!currentContent) return;
    setCurrentCode(currentContent!);
    socketService.sendCodeChange(currentContent!);
  };

  const handleEditorDidMount = async (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  const handleResetToDefaultCode = () => {
    setCurrentCode(getCodeTemplate(matchedLanguage, questionTitle));
    socketService.sendCodeChange(
      getCodeTemplate(matchedLanguage, questionTitle)
    );
  };

  return (
    <div className="h-[calc(100vh-60px)]">
      <CodeEditorNavbar handleResetToDefaultCode={handleResetToDefaultCode} />
      <Divider className="space-y-2" />
      <CodeEditor
        currentCode={currentCode}
        handleEditorChange={handleEditorChange}
        handleEditorDidMount={handleEditorDidMount}
      />
    </div>
  );
};

export default CodeEditorPanel;
