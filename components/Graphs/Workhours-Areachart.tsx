"use client";

import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis, Label, CartesianGrid } from 'recharts';

const data = [
  { name: '32', value: 5 },
  { name: '36', value: 20 },
  { name: '40', value: 65 },
  { name: '44', value: 21 },
  { name: '48', value: 11 },
  { name: '52', value: 8 },
  { name: '56', value: 1 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-600">{`${label} hours`}</p>
        <p className="text-sm font-semibold text-indigo-600">
          {`${payload[0].value} employees`}
        </p>
      </div>
    );
  }
  return null;
};

const AreaChartComponent = () => {
  return (
    <div className="w-full h-[250px] p-2 rounded-lg overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          >
            <Label 
              value="Work Hours" 
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
              value="Number of Employees" 
              angle={-90} 
              position="insideLeft" 
              fill="#4b5563"
              fontSize={12}
              dy={60}
            />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#818cf8" 
            strokeWidth={2}
            fill="url(#colorSessions)"
            animationDuration={1500}
            dot={{ stroke: '#818cf8', strokeWidth: 2, r: 4, fill: '#fff' }}
            activeDot={{ stroke: '#818cf8', strokeWidth: 2, r: 6, fill: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent;