"use client";

import { FC } from "react";
import Split from "react-split";
import ProblemPanel from "./ProblemPanel";
import CodeEditorPanel from "./CodeEditorPanel";

interface WorkspaceProps {}

const Workspace: FC<WorkspaceProps> = ({}) => {
  return (
    <Split className="flex flex-row">
      <ProblemPanel />
      <CodeEditorPanel />
    </Split>
  );
};

export default Workspace;
