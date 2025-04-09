"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LeaveData {
  name: string;
  value: number;
}

const COLORS = {
  'Annual Leave': '#10b981',    // emerald
  'Casual Leave': '#3b82f6',    // blue
  'Sick Leave': '#f59e0b',      // amber
  'Unpaid Leave': '#ef4444'     // red
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-slate-200">{payload[0].name}</p>
        <p className="text-sm font-semibold text-slate-200">
          {`${payload[0].value} leaves`}
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

const LeavesPieChart = () => {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [chartData, setChartData] = useState<LeaveData[]>([]);

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/hr/leaves-distribution?year=${selectedYear}`,
          { withCredentials: true }
        );
        
        const leaves = response.data.distribution;
        const formattedData = Object.entries(leaves).map(([type, count]) => ({
          name: type,
          value: count as number
        }));
        
        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching leaves data:', error);
      }
    };

    fetchData();
  }, [selectedYear]);

  return (
    <div className="w-full h-full p-4 rounded-lg bg-slate-800/80">
      <div className="flex flex-col items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-slate-200 mb-2">Leave Distribution</h3>
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
            No data available for selected year
          </div>
        )}
      </div>
    </div>
  );
};

export default LeavesPieChart;