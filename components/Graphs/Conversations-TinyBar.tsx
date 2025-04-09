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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  name: string;
  value: number;
}

const TinyBarChart = () => {
  const curMonth = new Date().getMonth()+1;
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(curMonth.toString());
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/hr/sessions/daily-count?month=${selectedMonth}&year=${selectedYear}`,
          { withCredentials: true }
        );
        
        const dailyCount = response.data.daily_counts;
        // Convert object to array format that chart expects
        const formattedData = Object.entries(dailyCount).map(([day, count]) => ({
          name: (parseInt(day) + 1).toString(), // Add 1 since days are 0-indexed in response
          value: count as number
        })).sort((a, b) => parseInt(a.name) - parseInt(b.name)); // Sort by day number
        
        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

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
          <p className="text-sm font-medium text-gray-600">{`Day ${label}`}</p>
          <p className="text-sm font-semibold text-blue-600">
            {`${payload[0].value} conversations`}
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
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[130px] bg-slate-700 border-slate-600 text-slate-200">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {months.map((month) => (
                <SelectItem 
                  key={month.value} 
                  value={month.value}
                  className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700 focus:text-slate-200"
                >
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  value="Days" 
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
                  value="Conversations" 
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
                    fill={getBlueShade(entry.value)}
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No data available for selected period
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