import { FC } from "react";
import Split from "react-split";
import ProblemPanel from "./ProblemPanel";
import CodeEditorPanel from "./CodeEditorPanel";

const Workspace: FC = ({}) => {
  return (
    <Split className="flex flex-row">
      <ProblemPanel />
      <CodeEditorPanel />
    </Split>
  );
};

export default Workspace;
