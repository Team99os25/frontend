"use client";

import { BarChart, Bar, Tooltip, ResponsiveContainer, XAxis, YAxis, Label } from 'recharts';

const WeekMap = ["", "Mon", "Tue", "Wed", "Thu", "Fri"];
let dayOfTheWeek = (new Date).getDay();
if(dayOfTheWeek == 6){
  dayOfTheWeek = 5;
  /*If viewed on a Saturday = 6, show data for last week, i.e. take current day to be Friday
  For Sunday = 0, || 5 already handles it and makes last day to be Friday */
}

const data = [
  { name: WeekMap[(dayOfTheWeek + 1) % 5 || 5], value: 12 },
  { name: WeekMap[(dayOfTheWeek + 2) % 5 || 5], value: 30 },
  { name: WeekMap[(dayOfTheWeek + 3) % 5 || 5], value: 20 },
  { name: WeekMap[(dayOfTheWeek + 4) % 5 || 5], value: 20 },
  { name: WeekMap[(dayOfTheWeek) % 5 || 5], value: 20, fill: '#F3D700' },
]; // || 5 handles the edge-case where dayOfTheWeek % 5 = 0

const TinyBarChart = () => {
  return (
    <div className="w-[400px] h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name">
            <Label value="Week" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Number of Sessions" angle={-90} dy={75} position="insideLeft" />
          </YAxis>
          <Bar dataKey="value" fill="#38bdf8" />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TinyBarChart;