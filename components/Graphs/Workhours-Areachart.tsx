"use client";

import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis, Label } from 'recharts';

const data = [
  { name: '32', value: 5 },
  { name: '36', value: 20 },
  { name: '40', value: 65 },
  { name: '44', value: 21 },
  { name: '48', value: 11 },
  { name: '52', value: 8 },
  { name: '56', value: 1 },
];

const AreaChartComponent = () => {
  return (
    <div className="w-[400px] h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name">
            <Label value="Work Hours" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Employees with Work Hours" angle={-90} dy={110} position="insideLeft" />
          </YAxis>
          <Area type="monotone" dataKey="value" stroke="#f87171" fill="#fecaca" />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent;