"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Vibemeter = () => {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [moods, setMoods] = useState({
        Frustrated: 0,
        Sad: 0,
        Okay: 0,
        Happy: 0,
        Excited: 0,
    });

    const [allSessions, setAllSessions] = useState([]);
    const [vibeMeterStatus, setVibeMeterStatus] = useState(false);

    useEffect(() => {
        const userDetails = localStorage.getItem("userDetails");

        // Check for null or empty string
        if (!userDetails) {
            router.push("/signin");
            return;
        }

        try {
            const userDetailsObject = JSON.parse(userDetails);
            if (!userDetailsObject || typeof userDetailsObject !== "object") {
                router.push("/signin");
            }
        } catch (error) {
            // If JSON parsing fails, redirect
            router.push("/signin");
        }
    }, []);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const allSessionsResponse = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/sessions/employee/`,
                    {
                        validateStatus: (status) => status < 600,
                        withCredentials: true,
                    },
                )

                console.log("sessionResponse:", allSessionsResponse.data);
                setAllSessions(allSessionsResponse.data);
            } catch (err) {
                console.error("Failed to load session:", err);
            }
        };
        const fetchvibemeter = async () => {
            try{
                const todayVibemeterStatus = axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/vibemeter/check`,
                    {
                        validateStatus: (status) => status < 600,
                        withCredentials: true,
                    },
                );
    
                const { data } = await todayVibemeterStatus;
                setVibeMeterStatus(data.should_submit);
            }   catch (err) {
                console.error("Failed to load vibemeter:", err);
            }
        }
        fetchvibemeter();
        fetchSession();
    }, []);

    const handleMoodSelect = (mood: string) => {
        if (selectedMood && selectedMood !== mood) {
            setMoods((prev) => ({
                ...prev,
                [selectedMood]: 0,
            }));
        }
        setSelectedMood(mood === selectedMood ? null : mood);
    };

    const handleMoodChange = (mood: string, value: number) => {
        setMoods((prev) => ({
            ...prev,
            [mood]: value,
        }));
    };

    const areAllMoodsSelected = () => {
        return Object.values(moods).some((value) => value !== 0);
    };

    const handleLogout = () => {
        localStorage.removeItem("userDetails");
        router.push("/signin");
    };

    const handleSubmitMood = async () => {
        setIsSubmitted(true);
        const cookies = document.cookie.split(";");
        const authToken = cookies
            .find((cookie) => cookie.trim().startsWith("auth_token="))
            ?.split("=")[1];
        console.log(cookies);

        const payload = {
            mood: selectedMood,
            scale: Object.values(moods).find((value) => value !== 0) || 0,
        };
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/vibemeter/submit`,
                payload,
                {
                    validateStatus: (status) => {
                        return status < 600;
                    },
                    withCredentials: true,
                },
            );
            console.log(response);

            if (response.status == 200) {
                toast.success(response.data.message);
                if (response.data.intervention_needed) {
                    router.push(`/sessions/${response.data.session_id}`);
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitted(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1e2337] via-[#2b3558] to-[#1e2337] relative">
            <Button
                variant="ghost"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`fixed top-2 z-[60] p-4 text-white md:hidden transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? "left-[264px]" : "left-2"
                } hover:bg-white/10`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={isSidebarOpen
                            ? "M6 18L18 6M6 6l12 12"
                            : "M4 6h16M4 12h16M4 18h16"}
                    />
                </svg>
            </Button>

            <div
                className={`w-64 bg-[#151823] backdrop-blur-xl text-white overflow-hidden fixed top-0 left-0 h-screen z-[55] transition-transform duration-300 ease-in-out transform md:translate-x-0 ${
                    isSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                } border-r border-white/10`}
            >
                <ScrollArea className="h-full p-6">
                    <h2 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                        Vibe History
                    </h2>
                    <nav className="space-y-4 flex-1">
                        {allSessions.map((session: any) => (
                            <Link
                                key={session.id}
                                href={`/sessions/${session.id}`}
                                className="block"
                            >
                                <div className="flex items-center gap-4 p-4 rounded-2xl shadow-sm bg-white hover:bg-teal-50 transition-colors border border-gray-100">
                                    <div className="w-3 h-3 rounded-full bg-teal-500 shadow-md">
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800 truncate">
                                            {`Vibe - ${
                                                new Date(session.started_at)
                                                    .toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        },
                                                    )
                                            }`}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </nav>

                    <Button
                        variant="outline"
                        className="mt-8 w-full bg-transparent text-white border-white/20
                            hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600
                            hover:border-transparent transition-all duration-300"
                        onClick={handleLogout}
                    >
                        Sign out
                    </Button>
                </ScrollArea>
            </div>

            <div className="min-h-screen md:ml-64 transition-all duration-300">
                {vibeMeterStatus
                    ? (
                        <div className="fixed inset-0 md:left-64 bg-[#1e2337]/50 backdrop-blur-sm z-[40] flex items-center justify-center">
                            <div className="bg-[#2b3558]/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-xl mx-4 animate-fadeIn">
                                <div className="p-4 md:p-6 border-b border-white/20">
                                    <h2 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300">
                                        How&apos;s Your Vibe Today?
                                    </h2>
                                    <p className="text-center text-blue-100/80 mt-2 text-base md:text-lg">
                                        Select your mood (only one option is
                                        required)
                                    </p>
                                </div>

                                <div className="p-4 md:p-6">
                                    <div className="space-y-3">
                                        {Object.entries(moods).map((
                                            [mood, value],
                                        ) => (
                                            <div
                                                key={mood}
                                                className={`bg-[#2b3558]/80 p-3 md:p-4 rounded-xl border-2 cursor-pointer 
                                                transition-all duration-300 hover:border-blue-400 
                                                ${
                                                    selectedMood === mood
                                                        ? "ring-2 ring-blue-400 border-blue-400"
                                                        : value
                                                        ? "border-teal-400"
                                                        : "border-white/20"
                                                }
                                                transform hover:scale-[1.02]`}
                                                onClick={() =>
                                                    handleMoodSelect(mood)}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-lg text-blue-100">
                                                        {mood}
                                                    </span>
                                                </div>
                                                {selectedMood === mood && (
                                                    <div className="flex gap-2 mt-3">
                                                        {[1, 2, 3, 4, 5, 6].map(
                                                            (
                                                                rating,
                                                            ) => (
                                                                <Button
                                                                    key={rating}
                                                                    variant={value ===
                                                                            rating
                                                                        ? "default"
                                                                        : "secondary"}
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        handleMoodChange(
                                                                            mood,
                                                                            rating,
                                                                        );
                                                                    }}
                                                                    disabled={isSubmitted}
                                                                    className={`flex-1 h-9 text-base font-medium
                                                                ${
                                                                        value ===
                                                                                rating
                                                                            ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white"
                                                                            : "bg-white/90 text-[#1e2337] hover:bg-white"
                                                                    }`}
                                                                >
                                                                    {rating}
                                                                </Button>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-center mt-4">
                                        <Button
                                            onClick={handleSubmitMood}
                                            disabled={isSubmitted ||
                                                !areAllMoodsSelected()}
                                            className={`px-6 h-10 text-base font-semibold
                                            ${
                                                areAllMoodsSelected()
                                                    ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white hover:from-blue-600 hover:to-blue-500"
                                                    : "bg-white/20 text-white/50 cursor-not-allowed"
                                            }`}
                                        >
                                            Submit Your Vibe
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    : (
                        <div className="flex flex-col items-center justify-center min-h-screen p-6">
                            <div className="text-center space-y-10 animate-fadeIn">
                                <div className="animate-bounce-slow">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-32 w-32 text-teal-300 mx-auto"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                    </svg>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300">
                                        Awesome Vibes!
                                    </h2>
                                    <p className="text-xl text-blue-100 max-w-md mx-auto">
                                        Keep that positive energy flowing. Every
                                        moment is an opportunity to elevate your
                                        vibe!
                                    </p>

                                    <div className="pt-8">
                                        <div className="flex flex-wrap justify-center gap-4">
                                            {[
                                                "Stay Focused",
                                                "Stay Strong",
                                                "Stay Positive",
                                            ].map((text, i) => (
                                                <div
                                                    key={text}
                                                    className="flex items-center bg-[#2b3558]/80 px-6 py-3 rounded-xl 
                                            border border-white/20 transition-all duration-300 
                                            hover:scale-105 hover:bg-[#2b3558] hover:border-blue-400/50
                                            text-blue-100 hover:shadow-lg hover:shadow-blue-500/10"
                                                >
                                                    <span className="mr-2">
                                                        {["🎯", "💪", "✨"][i]}
                                                    </span>
                                                    {text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </div>

            <Toaster />
        </div>
    );
};

export default Vibemeter;
