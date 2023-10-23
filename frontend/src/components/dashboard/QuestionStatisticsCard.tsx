import QuestionFilter from "./question-statistics/QuestionFilter";
import AttemptedQuestionTable from "./question-statistics/AttemptedQuestionTable";
import { useHistoryContext } from "@/contexts/history";
import { useEffect, useState } from "react";
import { QuestionHistory } from "@/types/history";

const QuestionStatisticsCard = () => {
  const { history, isLoading } = useHistoryContext();

  const [questionHistory, setQuestionHistory] = useState<QuestionHistory[]>();

  useEffect(() => {
    if (history && history.length > 0) {
      setQuestionHistory(history);
    }
  }, [history]);

  if (!questionHistory) {
    return null;
  }

  return (
    <div className="flex flex-col h-full gap-2 bg-black rounded-lg p-4 overflow-y-auto">
      {isLoading ? (
        <>Loading animation</>
      ) : (
        <>
          <QuestionFilter />
          {questionHistory && questionHistory.length > 0 && (
            <AttemptedQuestionTable history={questionHistory} />
          )}
        </>
      )}
    </div>
  );
};

export default QuestionStatisticsCard;
