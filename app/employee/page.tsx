"use client";

// import SmartToyIcon from "@mui/icons-material/SmartToy";
import Chatbot from "../chatbot/page";
import { useRouter } from "next/navigation";

const EmployeeDashboard = () => {

  const router = useRouter();

  return (  
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Employee Dashboard</h2>
      <p className="text-gray-600 mb-4">Welcome to your dashboard! Here you can manage your tasks, view your performance metrics, and more.</p>
      <div className="flex flex-col space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg shadow">      
    <h1>
      Employee Dashboard
    </h1>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Tasks</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Task 1: Complete project report</li>
            <li>Task 2: Attend team meeting</li>
            <li>Task 3: Submit feedback</li>
          </ul>
        </div>
      </div>
      <div className="mt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          View Performance Metrics
        </button>
      </div>
    </div>
    <div>
        <button 
          className="flex flex-row items-center justify-center py-3 bg-green-500 px-4 m-4 rounded-lg"
          onClick={() => router.push('/chatbot')}
        >
          {/* <SmartToyIcon/> */}
          Let&apos;s talk
        </button>
      </div>
  </div>
  );
}
 
export default EmployeeDashboard;