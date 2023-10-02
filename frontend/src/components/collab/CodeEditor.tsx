import { Editor } from "@monaco-editor/react";
import { FC, RefObject, useEffect, useState } from "react";

interface CodeEditorProps {
  questionTitle?: string;
  language: string;
  // defaultCode: string;
  currentCode: string
  handleEditorChange?: (value: any, event: any) => void;
  handleEditorDidMount?: (editor: any, monaco: any) => void;
}

const CodeEditor: FC<CodeEditorProps> = ({
  language,
  currentCode,
  handleEditorChange,
  handleEditorDidMount,
}) => {

  return (
    <div className="mt-1 p-2">
      <Editor
        width="100%"
        height="100vh"
        theme="vs-dark"
        defaultLanguage={language}
        // defaultValue={defaultCode}
        value={currentCode}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
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
