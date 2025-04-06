"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Vibemeter = () => {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [moods, setMoods] = useState({
        Frustrated: 0,
        Sad: 0, 
        Okay: 0,
        Happy: 0,
        Excited: 0,
    });
    const [goodToGo, setGoodToGo] = useState(false);
    const [isVibeMeterOpen, setIsVibeMeterOpen] = useState(false);
    const [isCheckingIntervention, setIsCheckingIntervention] = useState(false);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const userDetails = localStorage.getItem("userDetails");
        if (userDetails) {
            router.push("/signin");
        }
    }, [router]);

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

    const chatRequired = async () => {
        setIsCheckingIntervention(true);
        try {
            const response = await axios.post(
                "http://localhost:3000/api/user/intervention",
                moods,
                {
                    validateStatus: (status) => {
                        return status < 600;
                    },
                }
            );
            
            if (response.data.requiresIntervention === false) {
                setIsCheckingIntervention(false);
                setIsVibeMeterOpen(false);
            } else {
                setIsCheckingIntervention(false);
                setShowChat(true);
            }
        } catch (error) {
            console.error(error);
            setIsCheckingIntervention(false);
            toast.error("Something went wrong!");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userDetails");
        router.push("/signin");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`fixed top-20 z-50 p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 min-[700px]:hidden transition-all duration-500 ease-in-out ${
                    isSidebarOpen ? "left-[264px]" : "left-4"
                }`}
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
            </button>

            <div
                className={`w-64 bg-gray-800 text-white overflow-y-auto fixed h-screen transition-all duration-500 ease-in-out min-[700px]:translate-x-0 min-[700px]:static ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="p-4 pt-4">
                    <h2 className="text-xl font-semibold mb-4">
                        Previous Vibes
                    </h2>
                    <nav className="space-y-2">
                        <Link
                            href="/title1"
                            className="block p-2 hover:bg-gray-700 rounded border-b border-white"
                        >
                            title1
                        </Link>
                        <Link
                            href="/title1"
                            className="block p-2 hover:bg-gray-700 rounded border-b border-white"
                        >
                            title2
                        </Link>
                        <Link
                            href="/title1"
                            className="block p-2 hover:bg-gray-700 rounded border-b border-white"
                        >
                            title1
                        </Link>
                        <Link
                            href="/title1"
                            className="block p-2 hover:bg-gray-700 rounded border-b border-white"
                        >
                            title1
                        </Link>
                        <Link
                            href="/title1"
                            className="block p-2 hover:bg-gray-700 rounded border-b border-white"
                        >
                            title1
                        </Link>
                    </nav>
                    <Button className="fixed bottom-0 mb-4 hover:bg-white hover:text-gray-800" onClick={handleLogout}>Log out</Button>
                </div>
            </div>
            {isCheckingIntervention && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fadeIn">
                        <div className="text-center space-y-6">
                            <div className="relative w-20 h-20 mx-auto">
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Checking if intervention is required...
                            </h2>
                            <p className="text-gray-600">
                                Please wait while we analyze your responses
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {showChat && (
                <div className="fixed inset-0 bg-white z-50 animate-fadeIn">
                    <div className="h-full flex flex-col">
                        {/* Chat Header */}
                        <div className="bg-blue-600 text-white p-4">
                            <h2 className="text-xl font-semibold">Chat with Counselor</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-4">
                                <div className="bg-blue-100 rounded-lg p-4 max-w-md ml-auto">
                                    <p className="text-gray-800">
                                        Hi, I noticed you might want to talk. I'm here to listen and help.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t p-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isVibeMeterOpen && !showChat && !isCheckingIntervention && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col animate-fadeIn">
                        <div className="p-8 border-b border-gray-200">
                            <h2 className="text-4xl font-bold text-center text-gray-800">
                                How are you feeling today?
                            </h2>
                            <p className="text-center text-gray-600 mt-3 text-lg">
                                Please select only one mood to proceed
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <div className="w-full max-w-3xl mx-auto">
                                <div className="space-y-6">
                                    {Object.entries(moods).map(([mood, value]) => (
                                        <div
                                            key={mood}
                                            className={`bg-white p-7 rounded-lg shadow-md border-2 cursor-pointer 
                                                transition-all duration-200 hover:border-blue-500 
                                                ${selectedMood === mood
                                                    ? "ring-2 ring-blue-500 border-blue-500"
                                                    : value ? "border-green-500" : "border-gray-200"
                                                }
                                                transform hover:scale-[1.01]`}
                                            onClick={() => handleMoodSelect(mood)}
                                        >
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="font-semibold text-xl text-gray-800">
                                                    {mood}
                                                </span>
                                            </div>
                                            {selectedMood === mood && (
                                                <div className="flex gap-3 mt-5">
                                                    {[1, 2, 3, 4, 5, 6].map((rating) => (
                                                        <button
                                                            key={rating}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleMoodChange(mood, rating);
                                                            }}
                                                            disabled={isSubmitted}
                                                            className={`flex-1 py-4 rounded-lg text-lg font-medium transition-all duration-200
                                                                ${value === rating
                                                                    ? "bg-blue-500 text-white shadow-lg transform scale-105"
                                                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                                                } ${isSubmitted
                                                                    ? "cursor-not-allowed opacity-50"
                                                                    : "hover:transform hover:scale-105"
                                                                }`}
                                                        >
                                                            {rating}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-center mt-10 pb-8">
                                    <button
                                        onClick={chatRequired}
                                        disabled={isSubmitted || !areAllMoodsSelected()}
                                        className={`px-10 py-5 rounded-lg text-white text-lg font-semibold
                                            transition-all duration-300 transform
                                            ${areAllMoodsSelected()
                                                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105 shadow-lg"
                                                : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!isVibeMeterOpen && !showChat && !isCheckingIntervention && (
                <div className="flex flex-col items-center justify-center min-h-screen p-6">
                    <div className="text-center space-y-8 animate-fadeIn">
                        <div className="animate-bounce-slow">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-32 w-32 text-green-500 mx-auto"
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
                        
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold text-gray-800 animate-fadeIn">
                                You're Doing Great!
                            </h2>
                            <p className="text-xl text-gray-600 max-w-md mx-auto animate-fadeIn delay-200">
                                Keep up the positive energy. Remember, every day is a new opportunity to grow and succeed!
                            </p>
                            
                            <div className="pt-6">
                                <div className="flex flex-wrap justify-center gap-4 text-gray-700 animate-fadeIn delay-300">
                                    <div className="flex items-center bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow">
                                        <span className="mr-2">🎯</span>
                                        Stay Focused
                                    </div>
                                    <div className="flex items-center bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow">
                                        <span className="mr-2">💪</span>
                                        Stay Strong
                                    </div>
                                    <div className="flex items-center bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow">
                                        <span className="mr-2">✨</span>
                                        Stay Positive
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vibemeter;
