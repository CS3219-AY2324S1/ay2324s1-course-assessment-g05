import { FC, SetStateAction, useState } from "react";
import User from "@/types/user";
import CodeEditorNavbar from "./CodeEditorNavbar";
import { Divider } from "@nextui-org/react";
import Editor from "@monaco-editor/react";
import CodeEditor from "./CodeEditor";
import { getDefaultCode } from "@/utils/defaultCodeUtils";

interface CodeEditorPanelProps {
  partner: User;
  language: string;
}

const CodeEditorPanel: FC<CodeEditorPanelProps> = ({ partner, language }) => {
  const [defaultCode, setDefaultCode] = useState<string>(
    getDefaultCode(language)
  );

  const handleResetToDefaultCode = () => {
    setDefaultCode(getDefaultCode(language));
  };

  const handleEditorChange = (value: SetStateAction<string>, event: any) => {
    setDefaultCode(value);
  };

  return (
    <div>
      <CodeEditorNavbar
        partner={partner!}
        language={language}
        handleResetToDefaultCode={handleResetToDefaultCode}
      />
      <Divider className="space-y-2" />
      <CodeEditor
        language={language}
        defaultCode={defaultCode}
        handleEditorChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditorPanel;
