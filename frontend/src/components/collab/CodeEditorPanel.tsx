import { FC, use, useEffect, useRef, useState } from "react";
import CodeEditorNavbar from "./CodeEditorNavbar";
import { Divider } from "@nextui-org/react";
import CodeEditor from "./CodeEditor";
import { getCodeTemplate } from "@/utils/defaultCodeUtils";
import { useCollabContext } from "@/contexts/collab";
import Split from "react-split";
import ConsolePanel from "./console/ConsolePanel";
import ConsoleBar from "./console/ConsoleBar";
import { ConsoleProvider } from "@/contexts/console";

const CodeEditorPanel: FC = ({}) => {
  const { matchedLanguage, question, socketService } = useCollabContext();

  if (!socketService) return null;

  const questionTitle = question?.title || "";
  const editorRef = useRef(null);

  const [currentCode, setCurrentCode] = useState<string>(
    getCodeTemplate(matchedLanguage, questionTitle)
  );

  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(false);

  const [isCodeRunning, setIsCodeRunning] = useState<boolean>(false);

  useEffect(() => {
    socketService.receiveCodeUpdate(setCurrentCode);
  }, [socketService]);

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
    <ConsoleProvider>
      <div className="flex flex-col h-[calc(100vh-55px)]">
        <CodeEditorNavbar handleResetToDefaultCode={handleResetToDefaultCode} />
        <Divider className="space-y-2" />
        <Split
          className="flex flex-col h-full overflow-hidden"
          direction="vertical"
          sizes={isConsoleOpen ? [55, 45] : [100, 0]}
          minSize={isConsoleOpen ? [100, 100] : [100, 0]}
          gutterSize={isConsoleOpen ? 10 : 0}
        >
          <CodeEditor
            currentCode={currentCode}
            handleEditorChange={handleEditorChange}
            handleEditorDidMount={handleEditorDidMount}
          />
          <ConsolePanel isOpen={isConsoleOpen} isCodeRunning={isCodeRunning} />
        </Split>
        <Divider className="space-y-2" />
        <ConsoleBar
          isConsoleOpen={isConsoleOpen}
          setIsConsoleOpen={setIsConsoleOpen}
          setIsCodeRunning={setIsCodeRunning}
        />
      </div>
    </ConsoleProvider>
  );
};

export default CodeEditorPanel;
