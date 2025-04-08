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
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChartData {
  name: string;
  value: number;
}

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const TinyBarChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/hr/sessions/yearly-escalations?year=${selectedYear}`,
          { withCredentials: true }
        );
        
        const monthlyCount = response.data.monthly_counts;
        // Convert object to array format that chart expects
        const formattedData = Object.entries(monthlyCount).map(([month, count]) => ({
          name: months[parseInt(month)],
          value: count as number
        })).sort((a, b) => months.indexOf(a.name) - months.indexOf(b.name));
        
        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedYear]);

  const getPurpleShade = (value: number): string => {
    if (value < 15) return "#c4b5fd";
    if (value < 20) return "#a78bfa";
    if (value < 25) return "#8b5cf6";
    if (value < 30) return "#7c3aed";
    return "#6d28d9";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-600">{`${label}`}</p>
          <p className="text-sm font-semibold text-violet-600">
            {`${payload[0].value} escalations`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full p-4 rounded-lg bg-slate-800/80">
      <div className="flex flex-col items-center justify-between mb-4">
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px] bg-slate-700 border-slate-600 text-slate-200">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {years.map((year) => (
                <SelectItem 
                  key={year.value} 
                  value={year.value}
                  className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700 focus:text-slate-200"
                >
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-full h-[250px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
              <XAxis 
                dataKey="name"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              >
                <Label 
                  value="Months" 
                  offset={-5} 
                  position="insideBottom"
                  fill="#94a3b8"
                  fontSize={12}
                />
              </XAxis>
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              >
                <Label 
                  value="Escalations" 
                  angle={-90} 
                  position="insideLeft"
                  fill="#94a3b8"
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
                    fill={getPurpleShade(entry.value)}
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No data available for selected year
          </div>
        )}
      </div>
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