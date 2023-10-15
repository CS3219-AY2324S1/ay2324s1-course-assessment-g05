import History from "@/types/history";
import QuestionFilter from "./question-statistics/QuestionFilter";
import AttemptedQuestionTable from "./question-statistics/AttemptedQuestionTable";
import { useHistoryContext } from "@/contexts/history";

const QuestionStatisticsCard = () => {
  const { isLoading } = useHistoryContext();

  return (
    <div className="flex flex-col h-full gap-2 bg-black rounded-lg p-4 overflow-y-auto">
      {isLoading ? (
        <>Loading animation</>
      ) : (
        <>
          <QuestionFilter />
          <AttemptedQuestionTable />
        </>
      )}
    </div>
  );
};

export default QuestionStatisticsCard;
