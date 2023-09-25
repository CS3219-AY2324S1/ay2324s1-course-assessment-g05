import React from "react";
import ProfileCard from "./ProfileCard";
import HeatmapCard from "./HeatmapCard";
import MatchingCard from "../matching/MatchingCard";
import StatisticsCard from "./StatisticsCard";
import QuestionStatisticsCard from "./QuestionStatisticsCard";

const Dashboard = () => {
  return (
    <div className="grid grid-rows-2 grid-cols-4 gap-4 p-[30px] h-[92vh]">
      <div className="row-start-1 col-start-1">
        <ProfileCard />
      </div>
      <div className="row-start-1 col-start-2 col-span-2">
        <HeatmapCard />
      </div>
      <div className="row-start-1 col-start-4">
        <MatchingCard />
      </div>
      <div className="row-start-2 col-start-1">
        <StatisticsCard />
      </div>
      <div className="row-start-2 col-start-2 col-span-3">
        <QuestionStatisticsCard />
      </div>
    </div>
  );
};

export default Dashboard;
