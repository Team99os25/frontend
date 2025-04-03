"use client";

import Sidenav from "@/components/Sidenav";

export type SidenavProps = {
  elements: string[];
};

const HRDashboard = () => {
  
  return (  
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">HR Dashboard</h1>
      <p className="mt-4 text-lg">Welcome to the HR Dashboard!</p>
      <p className="mt-2 text-lg">Here you can manage employee records, payroll, and more.</p>
      <Sidenav elements={["Employee Records", "Payroll Management", "Reports", "Settings", "Logout"]} />
      {/* <nav className="flex flex-col items-start mt-6 justify-content-center">
        <ul className="mt-6 space-y-4">
          <li>
            <button className="px-4 py-2 rounded-lg hover:bg-blue-700 transition w-40">
              Employee Records
            </button>
          </li>
          <li>
            <button className="px-4 py-2 rounded-lg hover:bg-green-700 transition w-40">
              Payroll Management
            </button>
          </li>
          <li>
            <button className="px-4 py-2 rounded-lg hover:bg-red-700 transition w-40">
              Reports
            </button>
          </li>
        </ul>
        <ul className="mt-6 space-y-4">
          <li>
            <button className="px-4 py-2 rounded-lg hover:bg-yellow-700 transition w-40">
              Settings
            </button>
          </li>
          <li>
            <button className="px-4 py-2 rounded-lg hover:bg-purple-700 transition w-40">
              Logout
            </button>
          </li>
        </ul>
      </nav> */}
    </div>
  );
}
 
export default HRDashboard;