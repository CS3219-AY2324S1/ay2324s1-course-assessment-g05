import { Link } from "@nextui-org/react";
import ActivityHeatMap from "./heatmap/ActivityHeatMap";
import { CLIENT_ROUTES } from "@/common/constants";

const HeatmapCard = () => {
  return (
    <div className="flex flex-col h-full p-4 py-2 bg-black rounded-lg">
      <ActivityHeatMap />
      <div>
        <Link
          href={`${CLIENT_ROUTES.QUESTIONS}/history`}
          className="text-sm mx-2"
        >
          View all attempted questions
        </Link>
      </div>
    </div>
  );
};

export default HeatmapCard;
