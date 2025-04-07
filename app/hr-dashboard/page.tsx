"use client";
import dynamic from 'next/dynamic';

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

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* <Sidenav elements={["Employee Records", "Payroll Management", "Reports", "Settings", "Logout"]} /> */}
      <div className="graphs grid grid-cols-3 gap-x-10 gap-y-40 my-28">
        <div className='chart-1 h-36'>
          <div className="chart mb-2">
            <ConversationsTinyBar />
          </div>
          <div className="chart-text text-center pl-12">
            Number of Conversations
          </div>
        </div>
        <div className='chart-1 h-36'>
          <div className="chart mb-2">
            <EscalationsTinyBar />
          </div>
          <div className="chart-text text-center pl-12">
            Escalations in the last months
          </div>
        </div>
        <div className='chart-3 h-36 mt-8'>
          <div className="chart mb-[26px]">
            <SentimentsPiChart />
          </div>
          <div className="chart-text text-center">
            Employee Sentiments Distribution
          </div>
        </div>
        <div className='chart-4 h-36'>
          <div className="chart mb-2">
            <WorkhoursAreaChart />
          </div>
          <div className="chart-text text-center">
            Employee Workhour Distribution
          </div>
        </div>
        <div className='chart-5 h-36'>
          <div className="chart mb-2">
            <LeavesSimpleLine />
          </div>
          <div className="chart-text text-center">
            Leaves in the last months
          </div>
        </div>
        <div className='chart-6 h-36'>
          <div className="chart mb-2">
            <PerformanceSimpleLine />
          </div>
          <div className="chart-text text-center">
            Perfomance Review
          </div>
        </div>
      </div>
      <div className="datatable my-10">
        <div className="table-heading text-center text-4xl font-bold">
          Lorem Ipsum
        </div>
        <div className="table">
          <DataTableComponent />
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;