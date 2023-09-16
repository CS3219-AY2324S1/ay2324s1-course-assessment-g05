import React from "react";
import ProfileCard from "./ProfileCard";
import HeatmapCard from "./HeatmapCard";
import MatchingCard from "./MatchingCard";
import StatisticsCard from "./StatisticsCard";
import QuestionStatisticsCard from "./QuestionStatisticsCard";

const Dashboard = () => {
  return (
    <div className="grid grid-row-2 grid-cols-4 gap-4 p-[20px]">
      <div className="grid-row-1 grid-col-1">
        <ProfileCard />
      </div>
      <div className="grid-row-1 grid-col-2 col-span-2">
        <HeatmapCard />
      </div>
      <div className="grid-row-1 grid-col-4">
        <MatchingCard />
      </div>
      <div className="grid-row-2 grid-col-1">
        <StatisticsCard />
      </div>
      <div className="grid-row-2 grid-col-2 col-span-3">
        <QuestionStatisticsCard />
      </div>
    </div>
  );
};

export default Dashboard;
