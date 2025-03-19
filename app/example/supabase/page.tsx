import { createClient } from "@/lib/supabase";

type Instrument = {
  id: number;
  name: string;
};

export default async function Instruments() {
  const supabase = await createClient();

  const { data: instruments, error } = await supabase.from("instruments").select("*");

  if (error) {
    return <p className="text-red-500">Error loading instruments: {error.message}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 bg-gray-50">
    <h2 className="text-2xl font-semibold mb-6">Instruments List</h2>
  
    {instruments && instruments.length > 0 ? (
      <div className="overflow-x-auto w-full max-w-lg">
        <table className="min-w-full border-collapse border border-gray-300 shadow-lg bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 px-6 py-3">ID</th>
              <th className="border border-gray-300 px-6 py-3">Name</th>
            </tr>
          </thead>
          <tbody>
            {instruments.map((instrument: Instrument) => (
              <tr key={instrument.id} className="border-t hover:bg-gray-100 transition">
                <td className="border border-gray-300 px-6 py-3 text-center">{instrument.id}</td>
                <td className="border border-gray-300 px-6 py-3">{instrument.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-gray-500 mt-4">No instruments found.</p>
    )}
  </div>
  
  );
}
