"use client";

import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis, Label } from 'recharts';

const data = [
  { name: '1', value: 10 },
  { name: '2', value: 25 },
  { name: '3', value: 15 },
  { name: '4', value: 48 },
];

const SimpleLineChart = () => {
  return (
    <div className="w-[400px] h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name">
            <Label value="Rating" offset={-1} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="No. of Employees" angle={-90} dy={55} position="insideLeft" />
          </YAxis>
          <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleLineChart;