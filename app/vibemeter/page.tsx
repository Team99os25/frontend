"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

    const handleMoodSelect = (mood: string) => {
        if (selectedMood && selectedMood !== mood) {
            // Reset the previous mood's value
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
        if (!areAllMoodsSelected()) {
            toast.error(
                "Please select at least one mood before submitting.",
            );
            return;
        }

        setIsLoading(true);
        setIsSubmitted(true);
        setIsPopoverOpen(true);
        try {
            const response = await axios.post("", {
                moods,
            });
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(true);
            setIsPopoverOpen(true);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userDetails");
        router.push("/signin");
    };

    return (
        <div className="flex min-h-screen">
            <Toaster />
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

            <section className="flex-1 flex flex-col bg-gray-100 pt-4">
                <div className="top-0 bg-gray-100 p-4 border-b">
                    <h1 className="text-3xl font-bold text-center">
                        How are you feeling today?
                    </h1>
                </div>
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="w-full max-w-2xl mx-auto">
                        <div className="space-y-6">
                            {Object.entries(moods).map(([mood, value]) => (
                                <div
                                    key={mood}
                                    className={`bg-white p-4 rounded-lg shadow cursor-pointer transition-all duration-200 ${
                                        selectedMood === mood ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                    onClick={() => handleMoodSelect(mood)}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold">
                                            {mood}
                                        </span>
                                    </div>
                                    {selectedMood === mood && (
                                        <div className="flex gap-2 mt-4">
                                            {[1, 2, 3, 4, 5, 6].map((rating) => (
                                                <button
                                                    key={rating}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMoodChange(mood, rating);
                                                    }}
                                                    disabled={isSubmitted}
                                                    className={`flex-1 py-2 rounded ${
                                                        value === rating
                                                            ? "bg-blue-500 text-white"
                                                            : "bg-gray-200 hover:bg-gray-300"
                                                    } ${
                                                        isSubmitted
                                                            ? "cursor-not-allowed opacity-50"
                                                            : ""
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
                        <div className="flex justify-center mt-8">
                            <Popover
                                open={isPopoverOpen}
                                onOpenChange={setIsPopoverOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        onClick={chatRequired}
                                        disabled={isSubmitted || !areAllMoodsSelected()}
                                    >
                                        Submit
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    className="fixed bottom-60 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]"
                                    onPointerDownOutside={(e) =>
                                        e.preventDefault()}
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <p className="text-2xl font-bold text-center break-words">
                                            Checking if Intervention is
                                            required...
                                        </p>
                                        {isLoading && (
                                            <svg
                                                className="animate-spin h-8 w-8 text-blue-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                >
                                                </circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                >
                                                </path>
                                            </svg>
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Vibemeter;
