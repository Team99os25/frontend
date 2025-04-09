"use client";
import dynamic from 'next/dynamic';
import { EmployeeList } from "@/components/EmployeeList";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// import Sidenav from "../../../components/Sidenav";
//import { MyChart } from "@/components/Graphs/Piechart";
const SentimentsPiChart = dynamic(() => import('@/components/Graphs/Sentiments-Piechart'), { ssr: false });
const ConversationsTinyBar = dynamic(() => import('@/components/Graphs/Conversations-TinyBar'), { ssr: false });
const EscalationsTinyBar = dynamic(() => import('@/components/Graphs/Escalations-Tinybar'), { ssr: false });
const WorkhoursAreaChart = dynamic(() => import('@/components/Graphs/Workhours-Areachart'), { ssr: false });
const LeavesSimpleLine = dynamic(() => import('@/components/Graphs/Leaves-SimpleLine'), { ssr: false });
const PerformanceSimpleLine = dynamic(() => import('@/components/Graphs/Performance-SimpleLine'), { ssr: false });
const DataTableComponent = dynamic(() => import('@/components/Table/Table'), { ssr: false });


export type SidenavProps = {
  elements: string[];
};

interface Employee {
  employeeId: string;
  employeeName: string;
  vulnerabilityScore: number;
  date: string;
}

const HRDashboard = () => {
  // Mock data for employee lists
  const [highRiskEmployees, setHighRiskEmployees] = useState<Employee[]>([])
  const [notEsclated, setNotEscalated] = useState<Employee[]>([])
  // const highRiskEmployees = [
  //   {
  //     employeeId: "EMP001",
  //     employeeName: "John Doe",
  //     vulnerabilityScore: 8,
  //     date: "2024-03-15"
  //   },
  //   {
  //     employeeId: "EMP002",
  //     employeeName: "Jane Smith",
  //     vulnerabilityScore: 9,
  //     date: "2024-03-14"
  //   },
  //   {
  //     employeeId: "EMP003",
  //     employeeName: "Mike Johnson",
  //     vulnerabilityScore: 7,
  //     date: "2024-03-13"
  //   }
  // ];
  const router = useRouter();

  useEffect(() => {
    const userDetails = localStorage.getItem('userDetails');

    if (!userDetails) {
      router.push('/signin');
      return;
    }

    try {
      const userDetailsObject = JSON.parse(userDetails);
      if (!userDetailsObject || typeof userDetailsObject !== 'object') {
        router.push('/signin');
      }
    } catch (error) {
      router.push('/signin');
    }
  }, [router]);
  
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

  useEffect(() => {
      axios.get("http://localhost:8000/hr/escalated-chats", {withCredentials:true})
        .then((res) => {
          var highRiskEmploye: Employee[] = [];
          res.data.forEach(dat => {
                highRiskEmploye.push({
                  employeeId: dat.emp_id,
                  employeeName: dat.emp_name,
                  vulnerabilityScore: dat.vulnerability_score,
                  date: new Date(dat.last_session_date).toLocaleDateString('en-GB')
                })
          })
          setHighRiskEmployees(highRiskEmploye)
        })

        axios.get("http://localhost:8000/hr/intervention-sessions", {withCredentials:true})
        .then((res) => {
          var notEsclated: Employee[] = [];
          res.data.forEach(dat => {
            notEsclated.push({
                  employeeId: dat.emp_id,
                  employeeName: dat.emp_name,
                  vulnerabilityScore: dat.vulnerability_score,
                  date: new Date(dat.started_at).toLocaleDateString('en-GB')
                })
          })
          setNotEscalated(notEsclated)
        })
        .catch((err) => {
          console.error('Error:', err.response?.data || err.message);
        });
   

  }, [])


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900">
      <div className="p-4 md:p-6">
        {/* Employee Lists Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-1/2">
            <EmployeeList
              title="Escalated"
              employees={highRiskEmployees}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2">
            <EmployeeList
              title="Not Escalated"
              employees={notEsclated}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 shadow-lg"
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="graphs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chartConfigs.map(({ component, label, className }, idx) => (
            <div
              key={idx}
              className={`${className} bg-slate-800/80 backdrop-blur-sm rounded-lg 
                border border-slate-700 shadow-lg hover:shadow-blue-900/20 
                transition-all duration-300 p-6 cursor-pointer 
                transform hover:scale-[1.02] active:scale-[1.01]
                hover:border-blue-500/30`}
            >
              <div className="w-full h-full flex flex-col">
                <div className="text-sm font-medium text-slate-300 mb-4">{label}</div>
                <div className="flex-1 min-h-[200px] h-[250px]">
                  {component}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Uncomment and update the DataTable section if needed
        <div className="mt-12 bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-700 shadow-lg p-6">
          <div className="text-2xl font-semibold text-white mb-6">
            Employee Performance Overview
          </div>
          <div className="w-full overflow-x-auto">
            <DataTableComponent />
          </div>
        </div>
        */}
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