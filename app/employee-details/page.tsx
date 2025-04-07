"use client"

import Image from 'next/image'
import Speedometer from '@/components/circularScore';
import SpeedometerProps from '@/components/circularScore/index';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export interface Employee {
  employeeId: string
  employeeName: string
  employeeSummary: string
  employeePhoto: string
  rewardPoints: number
  latestMood: {
    scale: number,
    emotion: string,
  },
  leaves: {
    startDate: string,
    endDate: string,
    reason: string,
    numberOfDays: number
  },
  rewards: {
    reward: string,
    period: string,
  },
  awards: {
    award: string,
  },
  performance: {
    rating: string,
    period: string,
    managerFeedback: string,
    promotionConsideration: boolean,
  },
  activity: {
    emailsSent: number,
    workingHour: number,
  },
  session: {
    sessionsLastMonth: number,
    lastSessionDateTime: string,
    monthwiseSessions: object[],
  }
}

const EmployeeDetails = () => {

  const mockEmployee: Employee = {
    employeeId: "emp001",
    employeeName: "Tom Cruise",
    employeeSummary: "Tom is a highly valued member of our team." + "Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae nulla quia ad quibusdam voluptates dicta consequuntur quidem voluptas, cumque ducimus?",
    employeePhoto: "/tomCruisePhoto.jpg",
    rewardPoints: 410,

    latestMood: {
      scale: 4,
      emotion: "Happy",
    },

    leaves: {
      startDate: "2023-09-01",
      endDate: "2023-09-05",
      reason: "Vacation",
      numberOfDays: 5,
    },

    rewards: {
      reward: "Employee of the Month",
      period: "September 2023",
    },

    awards: {
      award: "Innovation Award"
    },

    performance: {
      rating: "Excellent",
      period: "Q3 2023",
      managerFeedback: "Outstanding contributions across all projects.",
      promotionConsideration: true,
    },

    activity: {
      emailsSent: 120,
      workingHour: 160,
    },

    session: {
      sessionsLastMonth: 3,
      lastSessionDateTime: "03/04/2024 5.00 pm",
      monthwiseSessions: [],
    }
  };

  const reward: string = mockEmployee.rewards.reward;

  const awards = {
    "Innovation Award": "💡",
    "Leadership Excellence": "🧭",
    "Best Team Player": "🤝",
    "Star Performer": "🌟",
  }

  // console.log(rewards["Innovation Award"])

  const router = useRouter();

  return ( 
    <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen py-10 px-6"> {/* <-- changed h-screen to min-h-screen + padding */}
      
      <div className="flex flex-row w-full max-w-7xl"> {/* <-- changed for max width */}
        <Image src="/tomCruisePhoto.jpg" alt='Employee photo' width={200} height={200} 
          className='rounded-md mx-5 cursor-pointer transform transition duration-200 ease-in-out active:scale-105 active:shadow-lg hover:scale-105 hover:shadow-lg'
        />
        
        <div className="flex flex-col ml-5 w-3/5 justify-between"> {/* <-- changed width */}
          <div className='flex flex-row'>
            <h1 className="font-bold text-4xl py-3 px-2 rounded-md text-gray-800 inline-block w-fit"> {/* <-- added bg + w-fit + inline-block */}
              {mockEmployee.employeeName} 
            </h1>
          </div>
          <p className="mt-2 mb-5 text-gray-700">
            {mockEmployee.employeeSummary}
          </p>
          <div className='flex flex-col text-gray-800'>
              <span>Number of Sessions this month: {mockEmployee.session.sessionsLastMonth}</span>
              <span>Last session: {mockEmployee.session.lastSessionDateTime}</span>
          </div>
        </div>

        <div className='flex flex-col items-center justify-center w-1/4'> {/* <-- center aligned speedometer */}
          <Speedometer score={mockEmployee.rewardPoints}/>
          {/* <h2 className='justify-center text-xl mt-5'>
            Innovation Award {awards["Innovation Award"]}
          </h2> */}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mt-10 w-full max-w-7xl"> {/* <-- changed to grid layout */}
        
        {/* Reused item styles in a more readable pattern */}
        {[
          { title: "Latest Mood", items: [
            {"Scale": mockEmployee.latestMood.scale}, 
            {"Emotion": mockEmployee.latestMood.emotion}, 
            {"Last 10 days": ""}] },
          { title: "Leaves", items: [
            {"Start date to end date": `${mockEmployee.leaves.startDate}-${mockEmployee.leaves.endDate}`}, 
            {"Reason": mockEmployee.leaves.reason}, 
            {"Number of days": mockEmployee.leaves.numberOfDays}] },
          { title: "Rewards", items: [
            {"Reward": mockEmployee.rewards.reward}, 
            {"Period": mockEmployee.rewards.period}] },
          { title: "Performance", items: [
            {"Rating": mockEmployee.performance.rating}, 
            {"Period": mockEmployee.performance.period}, 
            {"Manager Feedback": mockEmployee.performance.managerFeedback}, 
            {"Promotion Consideration": mockEmployee.performance.promotionConsideration}] },
          { title: "Activity", items: [
            {"Emails Sent": mockEmployee.activity.emailsSent}, 
            {"Working Hours": mockEmployee.activity.workingHour}, 
            {"Last 10 days": ""}] },
        ].map((section, index) => (
          <div key={index} className="bg-gray-800 text-center text-gray-50 rounded-md shadow-md transform transition duration-200 ease-in-out active:scale-105 active:shadow-lg hover:scale-105 hover:shadow-lg">
            <div className="py-2 font-semibold">{section.title}</div>
            <ul className="flex flex-col items-center justify-center bg-gray-300 text-gray-900 rounded-md py-3 space-y-1 h-full w-full">
              {section.items.map((item, i) => {
                const [key, value] = Object.entries(item)[0]
                return <li key={i}>{key}: {value}</li>
              })}
            </ul>
          </div>
        ))}

      </div> 

    </div>
  );
}
 
export default EmployeeDetails;































// "use client"

// import Image from 'next/image'
// import Speedometer from '@/components/circularScore';
// import SpeedometerProps from '@/components/circularScore/index';

// const EmployeeDetails = () => {

//   const employeeId: string = "emp001";
//   const employeeName: string = "Tom Cruise";
//   const employeeSummary: string = "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
//   const imageLink = "../tomCruise.jpg";
//   const sessionMissed: number = 4;
//   const performanceScore: number = 97;
//   const numberOfLeaves: number = 6;
//   const lastSessionDate: string = "2023-10-01";
//   const moods = {
//     "Frustrated": "😠",
//     "Sad": "😢",
//     "Neutral": "😐",
//     "Happy": "😊",
//     "Very Happy": "😃",
//   }
//   const reason: string = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, sint!"
//   const rewardPoints = 410;

//   return ( 
//     <div className="flex flex-col items-center justify-center bg-gray-100 h-screen"> 
//       <div className="flex flex-row w-full">
//         <Image src="/tomCruisePhoto.jpg" alt='Employee photo' width={200} height={200} className='rounded-md mx-5'/>
//         <div className="flex flex-col ml-5">
//           <h1 className="font-bold text-4xl py-3 px-2 rounded-md text-gray-800 animate-none w-3/5">{employeeName}</h1>
//           <p className="flex flex-row mt-2 mb-5 text-gray-700 animate-fadeSlide w-4/5">
//             {employeeSummary}
//           </p>
//         </div>
//         <div className='w-full'>
//           <Speedometer score={410}/>
//         </div>
//       </div>
//       <div className="flex flex-row mt-4">
//         <div className="py-2 w-1/4 mx-2 bg-gray-800 text-center rounded-md text-gray-50">
//           Latest Mood
//           <ul className="flex flex-col items-center justify-center bg-gray-300 h-full w-full text-gray-900 rounded-md">
//             <li>Scale</li>
//             <li>Emotion</li>
//             <li>Last 10 days</li>
//           </ul>
//         </div>
//         <div className="py-2 w-1/4 mx-2 bg-gray-800 text-center rounded-md text-gray-50 ">
//           Leaves
//           <ul className="flex flex-col items-center justify-center bg-gray-300 h-full text-gray-900 rounded-md">
//             <li>Start date to end date</li>
//             <li>Reason</li>
//             <li>Number of days</li>
//           </ul>
//         </div>
//         <div className="py-2 w-1/4 mx-2 bg-gray-800 text-center rounded-md text-gray-50">
//           Rewards
//           <ul className="flex flex-col items-center justify-center bg-gray-300 h-full text-gray-900 rounded-md">
//           <li>Reward</li>
//           <li>Period</li>
//           </ul>
//         </div>
//         <div className="py-2 w-1/4 mx-2 bg-gray-800 text-center rounded-md text-gray-50">
//           Performance
//           <ul className="flex flex-col items-center justify-center bg-gray-300 h-full text-gray-900 rounded-md">
//           <li>Rating</li>
//           <li>Period</li>
//           <li>Manager Feedback</li>
//           <li>Promotion Consideration</li>
//           </ul>
//         </div>
//         <div className="py-2 w-1/4 mx-2 bg-gray-800 text-center rounded-md text-gray-50">
//           Activity
//           <ul className="flex flex-col items-center justify-center bg-gray-300 h-full text-gray-900 rounded-md">
//             <li>Emails Sent</li>
//             <li>Working Hours</li>
//             <li>Last 10 days</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }
 
// export default EmployeeDetails;






// CODE TO CREATE A ZOOM IN AND DETAILED PROFILE PICTURE VIEW
/**
 * 
 * const [isModalOpen, setIsModalOpen] = useState(false);
   const [zoom, setZoom] = useState(1);
 * 
 * onClick={() => setIsModalOpen(true)}       => On click with the image
 * 
 * {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50'>
          <div className='relative'>
            <button onClick={() => setIsModalOpen(false)}>Exit</button>

            <div className='flex flex-col items-center'>
            <Image
                src={mockEmployee.employeePhoto}
                alt="Enlarged photo"
                width={800}
                height={800}
                style={{ transform: `scale(${zoom})` }}
                className="rounded-md transition-transform duration-300"
              />

              <div className='flex gap-4 mt-4'>
                <button
                  onClick={() => setZoom(zoom + 0.1)}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
                >
                  Zoom In +
                </button>
                <button
                  onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
                >
                  Zoom Out -
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
                >
                  Reset Zoom
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
 * 
 */