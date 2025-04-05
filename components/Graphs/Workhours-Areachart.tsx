"use client";

import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'A', value: 5 },
  { name: 'B', value: 20 },
  { name: 'C', value: 10 },
];

const AreaChartComponent = () => {
  return (
    <div className="w-[400px] h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <Area type="monotone" dataKey="value" stroke="#f87171" fill="#fecaca" />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent;