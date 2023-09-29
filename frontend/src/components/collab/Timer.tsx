"use client";

import React, { useEffect, useState } from "react";
import { Image } from "@nextui-org/react";

type TimerProps = {};

const Timer: React.FC<TimerProps> = () => {
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // retrieve time from local storage
  useEffect(() => {
    const time = localStorage.getItem("time");
    if (time) {
      setTime(parseInt(time));
    }
  }, []);

  // create timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      // temporary solution, will create API endpoint for keeping track of time state
      setTime((prevTime) => {
        localStorage.setItem("time", (prevTime + 1).toString());
        return prevTime + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {showTimer ? (
        <div className="flex items-center space-x-2 p-1.5 cursor-pointer rounded">
          <div onClick={() => setShowTimer(false)}>{formatTime(time)}</div>
        </div>
      ) : (
        <div
          className="flex items-center text-white cursor-pointer rounded"
          onClick={() => setShowTimer(true)}
        >
          <Image src="/timer.svg" className="" />
        </div>
      )}
    </div>
  );
};
export default Timer;
