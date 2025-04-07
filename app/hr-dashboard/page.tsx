"use client";
import dynamic from 'next/dynamic';
import { EmployeeList } from "@/components/EmployeeList";

import Sidenav from "@/components/Sidenav";
//import { MyChart } from "@/components/Graphs/Piechart";
const SentimentsPiChart = dynamic(() => import('@/components/Graphs/Sentiments-Piechart'), { ssr: false });
const ConversationsTinyBar = dynamic(() => import('@/components/Graphs/Conversations-TinyBar'), { ssr: false });
const EscalationsTinyBar = dynamic(() => import('@/components/Graphs/Escalations-Tinybar'), { ssr: false });
const WorkhoursAreaChart = dynamic(() => import('@/components/Graphs/Workhours-Areachart'), { ssr: false });
const LeavesSimpleLine = dynamic(() => import('@/components/Graphs/Leaves-SimpleLine'), { ssr: false });
const PerformanceSimpleLine = dynamic(() => import('@/components/Graphs/Performance-SimpleLine'), { ssr: false });
const DataTableComponent = dynamic(() => import('@/components/Table/Table'), {  ssr: false });


export type SidenavProps = {
  elements: string[];
};

const HRDashboard = () => {
  // Mock data for employee lists
  const highRiskEmployees = [
    {
      employeeId: "EMP001",
      employeeName: "John Doe",
      vulnerabilityScore: 8,
      date: "2024-03-15"
    },
    {
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      vulnerabilityScore: 9,
      date: "2024-03-14"
    },
    {
      employeeId: "EMP003",
      employeeName: "Mike Johnson",
      vulnerabilityScore: 7,
      date: "2024-03-13"
    }
  ];

  const mediumRiskEmployees = [
    {
      employeeId: "EMP004",
      employeeName: "Sarah Wilson",
      vulnerabilityScore: 5,
      date: "2024-03-15"
    },
    {
      employeeId: "EMP005",
      employeeName: "David Brown",
      vulnerabilityScore: 6,
      date: "2024-03-14"
    },
    {
      employeeId: "EMP006",
      employeeName: "Emily Davis",
      vulnerabilityScore: 4,
      date: "2024-03-13"
    }
  ];

  const chartConfigs = [
    {
      component: <ConversationsTinyBar />,
      label: "Number of Conversations",
    },
    {
      component: <EscalationsTinyBar />,
      label: "Escalations in the last months",
    },
    {
      component: <SentimentsPiChart />,
      label: "Employee Sentiments Distribution",
      // className: "mt-8",
    },
    {
      component: <WorkhoursAreaChart />,
      label: "Employee Workhour Distribution",
      className: "chart-4",
    },
    {
      component: <LeavesSimpleLine />,
      label: "Leaves in the last months",
      className: "chart-5",
    },
    {
      component: <PerformanceSimpleLine />,
      label: "Perfomance Review",
      // className: "chart-6",
    },
  ];
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-blue-900">
      <div className="p-4">
        {/* Employee Lists Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-1/2">
            <EmployeeList 
              title="Already Escalated" 
              employees={highRiskEmployees} 
            />
          </div>
          <div className="w-full md:w-1/2">
            <EmployeeList 
              title="Yet to be Escalated" 
              employees={mediumRiskEmployees} 
            />
          </div>
        </div>

        {/* Existing Charts Section */}
        <div className="graphs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chartConfigs.map(({ component, label, className }, idx) => (
            <div
              key={idx}
              className={`${className} bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 p-4 cursor-pointer transform hover:scale-[1.02] active:scale-[1.01]`}
            >
              <div className="w-full h-full flex flex-col">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</div>
                <div className="flex-1 min-h-[200px] h-[250px]">{component}</div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
          <div className="text-2xl font-semibold text-gray-800 mb-6">
            Employee Performance Overview
          </div>
          <div className="w-full overflow-x-auto">
            <DataTableComponent />
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default HRDashboard;


























/**
 * 
 * <div className="graphs grid grid-cols-3 gap-x-10 gap-y-40 my-28">
        <div className='chart-1 h-36 transform transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-105 active:shadow-lg'>
          <div className='w-full'>
            <div className="chart mb-2">
              <ConversationsTinyBar />
            </div>
            <div className="chart-text text-center pl-12">
              Number of Conversations
            </div>
          </div>
        </div>

        <div className='chart-1 h-36 transform transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-105 active:shadow-lg'>
          <div className='w-full'>
            <div className="chart mb-2">
              <EscalationsTinyBar />
            </div>
            <div className="chart-text text-center pl-12">
              Escalations in the last months
            </div>
          </div>
        </div>

        <div className='chart-3 h-36 mt-8 transform transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-105 active:shadow-lg'>
          <div className='w-full'>
            <div className="chart mb-[26px]">
              <SentimentsPiChart />
            </div>
            <div className="chart-text text-center">
              Employee Sentiments Distribution
            </div>
          </div>
        </div>

        <div className='chart-4 h-36 transform transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-105 active:shadow-lg'>
          <div className='w-full'>
            <div className="chart mb-2">
              <WorkhoursAreaChart />
            </div>
            <div className="chart-text text-center">
              Employee Workhour Distribution
            </div>
          </div>
        </div>

        <div className='chart-5 h-36 transform transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-105 active:shadow-lg'>
          <div className='w-full'>
            <div className="chart mb-2">
              <LeavesSimpleLine />
            </div>
            <div className="chart-text text-center">
              Leaves in the last months
            </div>
          </div>
        </div>

        <div className='chart-6 h-36 transform transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-105 active:shadow-lg'>
          <div className='w-full'>
            <div className="chart mb-2">
              <PerformanceSimpleLine />
            </div>
            <div className="chart-text text-center">
              Perfomance Review
            </div>
          </div>
        </div>
      </div>
 * 
 * 
 * 
 * 
 */