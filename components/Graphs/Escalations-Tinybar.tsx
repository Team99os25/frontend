"use client";

import { BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'A', value: 12 },
  { name: 'B', value: 30 },
  { name: 'C', value: 20 },
];

const TinyBarChart = () => {
  return (
    <div className="w-[400px] h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <Bar dataKey="value" fill="#38bdf8" />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TinyBarChart;