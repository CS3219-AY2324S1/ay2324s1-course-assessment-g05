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
  const editorRef = useRef(null);

  const [currentCode, setCurrentCode] = useState<string>(
    getCodeTemplate(matchedLanguage, question!)
  );

  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(false);

  const [isCodeRunning, setIsCodeRunning] = useState<boolean>(false);

  const [selectedConsoleTab, setSelectedConsoleTab] =
    useState<string>("testcase");

  useEffect(() => {
    socketService.receiveCodeUpdate(setCurrentCode);
  }, [socketService]);

  useEffect(() => {}, [isCodeRunning]);

  const handleEditorChange = (currentContent: string | undefined) => {
    if (!currentContent) return;
    setCurrentCode(currentContent!);
    socketService.sendCodeChange(currentContent!);
  };

  const handleEditorDidMount = async (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  const handleResetToDefaultCode = () => {
    setCurrentCode(getCodeTemplate(matchedLanguage, question!));
    socketService.sendCodeChange(getCodeTemplate(matchedLanguage, question!));
  };

  return (
    <ConsoleProvider>
      <div className="flex flex-col h-[calc(100vh-55px)]">
        <CodeEditorNavbar handleResetToDefaultCode={handleResetToDefaultCode} />
        <Divider className="space-y-2" />
        <Split
          className="flex flex-col h-full overflow-hidden"
          direction="vertical"
          sizes={isConsoleOpen ? [50, 50] : [100, 0]}
          minSize={isConsoleOpen ? [100, 100] : [100, 0]}
          gutterSize={isConsoleOpen ? 10 : 0}
        >
          <CodeEditor
            currentCode={currentCode}
            handleEditorChange={handleEditorChange}
            handleEditorDidMount={handleEditorDidMount}
          />
          <ConsolePanel
            isOpen={isConsoleOpen}
            selectedConsoleTab={selectedConsoleTab}
            setSelectedConsoleTab={setSelectedConsoleTab}
          />
        </Split>
        <Divider className="space-y-2" />
        <ConsoleBar
          code={currentCode}
          isConsoleOpen={isConsoleOpen}
          setIsConsoleOpen={setIsConsoleOpen}
          setSelectedConsoleTab={setSelectedConsoleTab}
        />
      </div>
    </ConsoleProvider>
  );
};

export default CodeEditorPanel;
