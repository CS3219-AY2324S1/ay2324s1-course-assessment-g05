import { FC, useEffect, useRef, useState } from "react";
import CodeEditorNavbar from "./CodeEditorNavbar";
import { Divider } from "@nextui-org/react";
import CodeEditor from "./CodeEditor";
import { getCodeTemplate } from "@/utils/defaultCodeUtils";

import { useCollabContext } from "@/contexts/collab";

const CodeEditorPanel: FC = ({}) => {
  const {
    partner,
    matchedLanguage,
    question,
    roomId,
    socketService,
    isSocketConnected,
  } = useCollabContext();

  const questionTitle = question?.title || "";
  const editorRef = useRef(null);

  const [currentCode, setCurrentCode] = useState<string>(
    getCodeTemplate(matchedLanguage, questionTitle)
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
    setCurrentCode(getCodeTemplate(matchedLanguage, questionTitle));
    socketService &&
      socketService.sendCodeChange(
        getCodeTemplate(matchedLanguage, questionTitle)
      );
  };

  return (
    <div>
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
