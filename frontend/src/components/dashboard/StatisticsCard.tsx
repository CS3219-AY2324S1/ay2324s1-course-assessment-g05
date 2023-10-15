import { HistoryService } from "@/helpers/history/history_api_wrappers";
import ComplexityDonutChart from "./donut-chart/ComplexityDonutChart";
import LanguageDonutChart from "./donut-chart/LanguageDonutChart";
import { useHistoryContext } from "@/contexts/history";

const StatisticsCard = () => {
  const { history, isLoading } = useHistoryContext();

  const complexityData =
    HistoryService.getNumberOfAttemptedQuestionsByComplexity(history);
  const languageData =
    HistoryService.getNumberOfAttemptedQuestionsByLanguage(history);

  return (
    <div className="flex flex-col h-full justify-start bg-black rounded-lg px-6 py-1 text-sm overflow-y-auto">
      <p className="mt-2">Solved Problems</p>
      {isLoading ? (
        <>Loading animation</>
      ) : (
        <>
          <ComplexityDonutChart
            data={complexityData}
            width={135}
            height={135}
          />
          <LanguageDonutChart data={languageData} width={135} height={135} />
        </>
      )}
    </div>
  );
};

export default StatisticsCard;
