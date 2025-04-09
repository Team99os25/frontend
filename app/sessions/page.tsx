'use client'
import { useEffect, useState } from "react";
import axios from "axios";

export default function Sessions() {
    const [allSessions, setAllSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");



    useEffect(() => {
        const fetchSession = async () => {
            try {
                const allSessionsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sessions/employee`, {
                    withCredentials: true,
                });
                
                setAllSessions(allSessionsResponse.data);
            } catch (err) {
                console.error("Failed to load session:", err);
                setError("Failed to load sessions. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-md">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8  p-24 min-h-screen">
            <div className="text-center mb-12">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                    Your Sessions at a Glance
                </h3>

                <a
                    href="/vibemeter"
                    className="inline-flex items-center justify-center px-10 py-4 text-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-teal-400 rounded-full shadow-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-500 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300 transform "
                >
                    <span className="mr-3">🔮</span>
                    <span>Explore Today&apos;s Session</span>
                </a>
            </div>



            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {allSessions.map((session: any) => (
                    <div key={session.id} className="bg-white p-6 transition-transform duration-300 ease-in-out transform hover:scale-105">
                        <a
                            href={`/sessions/${session.id}`}
                            className={`flex flex-col items-start justify-between space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 ease-in-out 
                    ${session.status === "completed" ? "border-green-600"
                                    : session.status === "active" ? "border-yellow-600"
                                        : "border-gray-300"}
                    hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50`}
                        >
                            <div className="absolute top-4 right-4 text-xs font-medium text-white bg-blue-500 px-3 py-1 rounded-full">
                                {session.status}
                            </div>

                            <div className="flex justify-between w-full">
                                <span className="text-2xl font-semibold text-gray-900">{`Session on ${new Date(session.started_at).toLocaleDateString()}`}</span>
                            </div>

                            <div className="flex justify-between w-full text-sm text-gray-500">
                                <span>{`Ended at: ${new Date(session.ended_at).toLocaleTimeString()}`}</span>
                            </div>

                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-full shadow-xl">
                                <span className="font-bold text-lg">{session.id.slice(0, 3)}</span>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </div>



    );
}
