import { Editor } from "@monaco-editor/react";
import { FC, useEffect, useState } from "react";

interface CodeEditorProps {
  questionTitle?: string;
  language: string;
  defaultCode: string;
  handleEditorChange?: (value: any, event: any) => void;
}

const CodeEditor: FC<CodeEditorProps> = ({
  language,
  defaultCode,
  handleEditorChange,
}) => {
  const [currentCode, setCurrentCode] = useState<string>(defaultCode);

  return (
    <div className="mt-1 p-2">
      <Editor
        width="100%"
        height="100vh"
        theme="vs-dark"
        defaultLanguage={language}
        defaultValue={defaultCode}
        value={defaultCode}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          glyphMargin: false,
          scrollbar: {
            horizontal: "hidden", // Hide horizontal scrollbar
            vertical: "hidden", // Hide vertical scrollbar
          },
        }}
      />
    </div>
  );
};

export default CodeEditor;
