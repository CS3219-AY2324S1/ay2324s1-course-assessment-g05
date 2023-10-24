import { HistoryService } from "@/helpers/history/history_api_wrappers";
import ComplexityDonutChart from "./donut-chart/ComplexityDonutChart";
import LanguageDonutChart from "./donut-chart/LanguageDonutChart";
import { useHistoryContext } from "@/contexts/history";
import { useEffect, useState } from "react";
import { DataItem } from "@/types/history";
import { Spinner } from "@nextui-org/react";

const StatisticsCard = () => {
  const { history, isLoading } = useHistoryContext();

  const [complexityData, setComplexityData] = useState<DataItem[]>([]);
  const [languageData, setLanguageData] = useState<DataItem[]>([]);

  useEffect(() => {
    if (!history || history.length === 0) {
      return;
    }

    const complexityCountMap =
      HistoryService.getNumberOfAttemptedQuestionsByComplexity(history);
    setComplexityData(complexityCountMap);
    const languageCountMap =
      HistoryService.getNumberOfAttemptedQuestionsByLanguage(history);
    setLanguageData(languageCountMap);
  }, [history, isLoading]);

  return (
    <div className="flex flex-col h-full justify-start bg-black rounded-lg px-6 py-1 text-sm overflow-y-auto">
      <p className="mt-2">Solved Problems</p>
      {isLoading ? (
        <div>
          <div className="flex justify-center">
            <Spinner size="md" />
          </div>
          <div className="flex justify-center">
            <span className="text-gray-500">Loading...</span>
          </div>
        </div>
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
