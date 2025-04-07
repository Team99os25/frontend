// components/Speedometer.tsx
"use client";

import React from "react";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export interface SpeedometerProps {
  score: number;
}

const Speedometer: React.FC<SpeedometerProps> = ({ score }) => {
  const [value, setValue] = useState(0);
  // const targetSpeed = Math.floor(Math.random() * 500); // simulate a random speed up to 500
  const targetSpeed = score; // use the score prop as the target speed

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => {
        if (prev >= targetSpeed) {
          clearInterval(interval);
          return targetSpeed;
        }
        return prev + 5; // speed increment
      });
    }, 20); // smooth animation
    return () => clearInterval(interval);
  }, [targetSpeed]);

  // const temp = value;

  return (
    <div className="w-52 h-52">
      <CircularProgressbar
        value={value}
        maxValue={500}
        text={`${value}`}
        styles={buildStyles({
          textColor: "#1f2937",
          pathColor: "#10b981", // green
          trailColor: "#d1d5db",
        })}
      />
    </div>
  );
};

export default Speedometer;