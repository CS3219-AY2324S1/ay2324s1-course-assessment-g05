import { FC } from "react";
import User from "@/types/user";
import CodeEditorNavbar from "./CodeEditorNavbar";
import { Divider } from "@nextui-org/react";
import Editor from "@monaco-editor/react";
import CodeEditor from "./CodeEditor";

interface CodeEditorPanelProps {
  partner: User;
  language: string;
}

const CodeEditorPanel: FC<CodeEditorPanelProps> = ({ partner, language }) => {
  return (
    <div>
      <CodeEditorNavbar partner={partner!} language={language} />
      <Divider className="space-y-2" />
      <CodeEditor language={language} />
    </div>
  );
};

export default CodeEditorPanel;
