import Question from "@/types/question";
import ProblemDescription from "./ProblemDescription";

interface ProblemPanelProps {
  question: Question;
}

const ProblemPanel = ({ question }: ProblemPanelProps) => {
  return (
    <div className="h-screen">
      <ProblemDescription question={question!} />
    </div>
  );
};

export default ProblemPanel;
