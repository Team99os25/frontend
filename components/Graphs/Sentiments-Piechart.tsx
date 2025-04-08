"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SentimentData {
  name: string;
  value: number;
}

const COLORS = {
  'Frustrated': '#ef4444', // red
  'Sad': '#f87171',       // lighter red
  'Okay': '#fcd34d',      // yellow
  'Happy': '#4ade80',     // green
  'Excited': '#22c55e'    // darker green
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-slate-200">{payload[0].name}</p>
        <p className="text-sm font-semibold text-slate-200">
          {`${payload[0].value}%`}
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const MyChart = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [chartData, setChartData] = useState<SentimentData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const response = await axios.get(
          `http://localhost:8000/hr/sentiment-distribution?date_str=${formattedDate}`,
          { withCredentials: true }
        );
        
        const distribution = response.data.distribution;
        const formattedData = Object.entries(distribution).map(([sentiment, value]) => ({
          name: sentiment,
          value: value as number
        }));
        
        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching sentiment data:', error);
      }
    };

    fetchData();
  }, [date]);

  return (
    <div className="w-full h-full p-4 rounded-lg bg-slate-800/80">
      <div className="flex flex-col items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-slate-200 mb-2">Sentiment Distribution</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[200px] justify-start text-left font-normal bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              disabled={{ after: new Date() }}
              initialFocus
              className="bg-slate-800 text-slate-200"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full h-[250px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={3}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name as keyof typeof COLORS]}
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value: string) => (
                  <span className="text-sm text-slate-200">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No data available for selected date
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChart;









































// "use client"; // Ensures it's only rendered on the client

// import { PieChart, Pie, Tooltip, Cell } from 'recharts';

// const data = [
//   { name: 'Score 1', value: 5, color: '#CDB4DB' },
//   { name: 'Score 2', value: 15, color: '#FFC8DD' },
//   { name: 'Score 3', value: 25, color: '#FFAFCC' },
//   { name: 'Score 4', value: 45, color: '#BDE0FE' },
//   { name: 'Score 5', value: 10, color: '#A2D2FF' },
// ];

// const MyChart = () => {
//   return (
//     <PieChart width={400} height={200}>
//       <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95}>
//       {data.map((entry, index) => (
//           <Cell key={`cell-${index}`} fill={entry.color} />
//         ))}
//       </Pie>
//       <Tooltip />
//     </PieChart>
//   );
// };

// export default MyChart; // Use default export
