"use client";

import {
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Label,
  Cell,
  CartesianGrid,
} from 'recharts';
import { useEffect, useState } from 'react';

const WeekMap = ["", "Mon", "Tue", "Wed", "Thu", "Fri"];

interface ChartData {
  name: string;
  value: number;
}

const TinyBarChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const dayOfTheWeek = new Date().getDay();
    const adjustedDay = dayOfTheWeek === 6 ? 5 : dayOfTheWeek;
    
    const data: ChartData[] = [
      { name: WeekMap[(adjustedDay + 1) % 5 || 5], value: 12 },
      { name: WeekMap[(adjustedDay + 2) % 5 || 5], value: 30 },
      { name: WeekMap[(adjustedDay + 3) % 5 || 5], value: 20 },
      { name: WeekMap[(adjustedDay + 4) % 5 || 5], value: 20 },
      { name: WeekMap[adjustedDay % 5 || 5], value: 20 },
    ];
    
    setChartData(data);
  }, []);

  const getBlueShade = (value: number): string => {
    if (value < 15) return "#bfdbfe";
    if (value < 20) return "#93c5fd";
    if (value < 25) return "#60a5fa";
    if (value < 30) return "#3b82f6";
    return "#2563eb";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-600">{`${label}`}</p>
          <p className="text-sm font-semibold text-blue-600">
            {`${payload[0].value} conversations`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[250px] p-2 rounded-lg overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis 
            dataKey="name"
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          >
            <Label 
              value="Week" 
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
              value="Number of Conversations" 
              angle={-90} 
              position="insideLeft"
              fill="#4b5563"
              fontSize={12}
              dy={60}
            />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value"
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBlueShade(entry.value)}
                className="hover:opacity-80 transition-opacity duration-300"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TinyBarChart;































// "use client";

// import { BarChart, Bar, Tooltip, ResponsiveContainer, XAxis, YAxis, Label } from 'recharts';

// const WeekMap = ["", "Mon", "Tue", "Wed", "Thu", "Fri"];
// let dayOfTheWeek = (new Date).getDay();
// if(dayOfTheWeek == 6){
//   dayOfTheWeek = 5;
//   /*If viewed on a Saturday = 6, show data for last week, i.e. take current day to be Friday
//   For Sunday = 0, || 5 already handles it and makes last day to be Friday */
// }

// const data = [
//   { name: WeekMap[(dayOfTheWeek + 1) % 5 || 5], value: 12 },
//   { name: WeekMap[(dayOfTheWeek + 2) % 5 || 5], value: 30 },
//   { name: WeekMap[(dayOfTheWeek + 3) % 5 || 5], value: 20 },
//   { name: WeekMap[(dayOfTheWeek + 4) % 5 || 5], value: 20 },
//   { name: WeekMap[(dayOfTheWeek) % 5 || 5], value: 20, fill: '#F3D700' },
// ]; // || 5 handles the edge-case where dayOfTheWeek % 5 = 0

// const TinyBarChart = () => {
//   return (
//     <div className="w-[400px] h-[250px]">
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart data={data}>
//           <XAxis dataKey="name">
//             <Label value="Week" offset={-5} position="insideBottom" />
//           </XAxis>
//           <YAxis>
//             <Label value="Number of Sessions" angle={-90} dy={75} position="insideLeft" />
//           </YAxis>
//           <Bar dataKey="value" fill="#38bdf8" />
//           <Tooltip />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default TinyBarChart;