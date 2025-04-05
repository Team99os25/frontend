"use client";

import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'A', value: 10 },
  { name: 'B', value: 25 },
  { name: 'C', value: 15 },
];

const SimpleLineChart = () => {
  return (
    <div className="w-[400px] h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleLineChart;