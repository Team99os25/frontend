"use client";

import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis, Label, CartesianGrid } from 'recharts';

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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-sm font-semibold text-emerald-600">
          {`${payload[0].value} leaves`}
        </p>
      </div>
    );
  }
  return null;
};

const SimpleLineChart = () => {
  return (
    <div className="w-full h-[250px] p-2 rounded-lg overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name"
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          >
            <Label 
              value="Month" 
              offset={-5} 
              position="insideBottom"
              fill="#4b5563"
              fontSize={12}
            />
          </XAxis>
          <YAxis
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          >
            <Label 
              value="Number of Leaves" 
              angle={-90} 
              position="insideLeft"
              fill="#4b5563"
              fontSize={12}
              dy={60}
            />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ stroke: '#10b981', strokeWidth: 2, r: 4, fill: '#fff' }}
            activeDot={{ stroke: '#10b981', strokeWidth: 2, r: 6, fill: '#fff' }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleLineChart;