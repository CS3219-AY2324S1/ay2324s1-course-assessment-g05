import { useCollabContext } from "@/contexts/collab";
import ProblemDescription from "../common/ProblemDescription";

const ProblemPanel = () => {
  const { question } = useCollabContext();

  if (!question) return;

  return (
    <div className="h-[calc(100vh-60px)]">
      <ProblemDescription question={question} />
    </div>
  );
};

export default ProblemPanel;
