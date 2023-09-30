import { FC } from "react";
import Split from "react-split";
import ProblemPanel from "./ProblemPanel";
import CodeEditorPanel from "./CodeEditorPanel";
import User from "@/types/user";
import Question from "@/types/question";

interface WorkspaceProps {
  question: Question;
  partner: User;
  language: string;
  roomId: string;
}

const Workspace: FC<WorkspaceProps> = ({
  question,
  partner,
  language,
  roomId,
}) => {
  return (
    <Split className="flex flex-row">
      <ProblemPanel question={question} />
      <CodeEditorPanel
        partner={partner}
        language={language}
        questionTitle={question.title}
        roomId={roomId}
      />
    </Split>
  );
};

export default Workspace;