import { HistoryService } from "@/helpers/history/api_wrappers";
import DonutChart from "@/components/dashboard/DonutChart";

const StatisticsCard = () => {
  const complexityData = HistoryService.getNumQuestionsForEachComplexity();
  return (
    <div className="flex flex-col h-full justify-start gap-4 bg-black rounded-lg p-6 text-sm">
      <p>Solved Problems</p>
      <DonutChart data={complexityData} />
    </div>
  );
};

export default StatisticsCard;
