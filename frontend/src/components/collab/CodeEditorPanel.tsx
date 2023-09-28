import { FC, SetStateAction, useState } from "react";
import User from "@/types/user";
import CodeEditorNavbar from "./CodeEditorNavbar";
import { Divider } from "@nextui-org/react";
import CodeEditor from "./CodeEditor";
import { getCodeTemplate } from "@/utils/defaultCodeUtils";

interface CodeEditorPanelProps {
  partner: User;
  language: string;
  questionTitle: string;
}

const CodeEditorPanel: FC<CodeEditorPanelProps> = ({
  partner,
  language,
  questionTitle,
}) => {
  const [defaultCode, setDefaultCode] = useState<string>(
    getCodeTemplate(language, questionTitle)
  );

  const handleResetToDefaultCode = () => {
    setDefaultCode(getCodeTemplate(language, questionTitle));
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
