import ActivityHeatMap from "./heatmap/ActivityHeatMap";

const HeatmapCard = () => {
  return (
    <div className="flex flex-col h-full p-4 py-2 bg-black rounded-lg">
      <ActivityHeatMap />
    </div>
  );
};

export default HeatmapCard;
