import Question from "@/types/question";
import ProblemDescription from "./ProblemDescription";
import { useCollabContext } from "@/contexts/collab";

const ProblemPanel = () => {
  return (
    <div className="h-screen">
      <ProblemDescription />
    </div>
  );
};

export default ProblemPanel;
