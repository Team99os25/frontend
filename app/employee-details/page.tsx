"use client"

const EmployeeDetails = () => {

  const employeeId: string = "emp001";
  const employeeName: string = "Santoshini Bhoi";
  const employeeSummary: string = "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  const imageLink: string = "/home/anshuman/development/miniProjects/openSoft/Datasets for IIT KGP Coding Challenge/tomCruisePhoto.jpg";
  const sessionMissed: number = 4;
  const performanceScore: number = 97;
  const numberOfLeaves: number = 6;
  const lastSessionDate: string = "2023-10-01";
  const moods = {
    "Frustrated": "😠",
    "Sad": "😢",
    "Neutral": "😐",
    "Happy": "😊",
    "Very Happy": "😃",
  }
  const reason: string = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, sint!"

  return ( 
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6 mt-20">
      <div className="flex flex-row">
        <img src={imageLink} alt="Employee photo" height={200} width={200}/>
        <div className="flex flex-col mx-12">
          <h1 className="font-bold bg-white text-3xl py-3 px-2 rounded-md">{employeeName}</h1>
          <p className="my-5">{employeeSummary}</p>
        </div>
      </div>
      <div className="flex flex-row mt-4">
        <div className="py-2 w-1/6 mx-2 bg-gray-400 text-center rounded-md">Number of leaves: {numberOfLeaves}</div>
        <div className="py-2 w-1/6 mx-2 bg-gray-400 text-center rounded-md">Performance Score: {performanceScore}</div>
        <div className="py-2 w-1/6 mx-2 bg-gray-400 text-center rounded-md">Number of sessions missed: {sessionMissed}</div>
        <div className="py-2 w-1/6 mx-2 bg-gray-400 text-center rounded-md">Last session taken: {lastSessionDate}</div>
        <div className="py-2 w-1/6 mx-2 bg-gray-400 text-center rounded-md">Mood of the Employee: {moods.Happy}</div>
        <div className="py-2 w-1/6 mx-2 bg-gray-400 text-center rounded-md">Reason of the mood: </div>
      </div>
    </div>
  );
}
 
export default EmployeeDetails;