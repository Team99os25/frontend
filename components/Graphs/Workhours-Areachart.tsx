"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis, Label, CartesianGrid } from 'recharts';
import { format, isMonday, previousMonday } from 'date-fns';
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-600">{`${label}`}</p>
        <p className="text-sm font-semibold text-indigo-600">
          {`${payload[0].value} hours`}
        </p>
      </div>
    );
  }
  return null;
};

const AreaChartComponent = () => {
  const [date, setDate] = useState<Date>(previousMonday(new Date()));
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/hr/work-hours-distribution?week_start_date=${formattedDate}`,
          { withCredentials: true }
        );
        
        const workHours = response.data.monthly_distributions["1"];
        const formattedData = Object.entries(workHours).map(([day, hours]) => ({
          name: day,
          value: parseFloat((hours as string).split(' ')[0]) // Extract numeric value from "X.0 hours"
        }));
        
        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching work hours data:', error);
      }
    };

    fetchData();
  }, [date]);

  return (
    <div className="w-full h-full p-4 rounded-lg bg-slate-800/80">
      <div className="flex flex-col items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-slate-200 mb-2">Work Hours Distribution</h3>
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
              disabled={(date) => !isMonday(date)}
              initialFocus
              className="bg-slate-800 text-slate-200"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={chartData}
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
                value="Days" 
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
                value="Work Hours" 
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
    </div>
  );
};

export default AreaChartComponent;