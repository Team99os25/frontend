"use client";

import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis, Label } from 'recharts';

const MonthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const currentMonth = new Date().getMonth(); // 0 = Jan, 11 = Dec

const data = [
  { name: MonthMap[(currentMonth + 1) % 12], value: 5 },
  { name: MonthMap[(currentMonth + 2) % 12], value: 17 },
  { name: MonthMap[(currentMonth + 3) % 12], value: 21 },
  { name: MonthMap[(currentMonth + 4) % 12], value: 9 },
  { name: MonthMap[(currentMonth + 5) % 12], value: 14 },
/*   { name: MonthMap[(currentMonth + 6) % 12], value: 15 },
  { name: MonthMap[(currentMonth + 7) % 12], value: 20 },
  { name: MonthMap[(currentMonth + 8) % 12], value: 18 },
  { name: MonthMap[(currentMonth + 9) % 12], value: 7 },
  { name: MonthMap[(currentMonth + 10) % 12], value: 11 },
  { name: MonthMap[(currentMonth + 11) % 12], value: 15 }, */
  { name: MonthMap[currentMonth], value: 15 },
];

const SimpleLineChart = () => {
  return (
    <div className="w-[400px] h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name">
            <Label value="Month" offset={-3} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="No. of Leaves" angle={-90} dy={40} position="insideLeft" />
          </YAxis>
          <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleLineChart;