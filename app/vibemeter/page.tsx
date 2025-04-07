'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import NoIntervention from "./NoIntervention";

export default function MoodSubmitter() {
    const router = useRouter();

    type Mood = 'Frustrated' | 'Sad' | 'Okay' | 'Happy' | 'Excited';

    const moodOptions: Mood[] = ['Frustrated', 'Sad', 'Okay', 'Happy', 'Excited'];

    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [moods, setMoods] = useState<Record<Mood, number>>({
        Frustrated: 0,
        Sad: 0,
        Okay: 0,
        Happy: 0,
        Excited: 0,
    });

    const [loading, setLoading] = useState(false);
    const [noIntervention, setNoIntervention] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [empId, setEmpId] = useState<string | null>(null);

    useEffect(() => {
        const userDetailsString = localStorage.getItem("UserDetails");
        if (userDetailsString) {
            const userDetails = JSON.parse(userDetailsString);
            setEmpId(userDetails?.emp_id || null);
        }
    }, []);

    const handleMoodSelect = (mood: Mood) => {
        if (!isSubmitted) setSelectedMood(mood);
    };

    const handleMoodChange = (mood: Mood, rating: number) => {
        setMoods((prev) => ({
            ...prev,
            [mood]: rating,
        }));
    };

    const handleSubmit = async () => {
        if (!empId ) return alert("Emp Id not found!");
        if ( !selectedMood) return alert("Please select your mood!");
        const scale = moods[selectedMood];
        if (scale === 0) return alert("Please rate your selected mood!");

        setLoading(true);
        setNoIntervention(false);

        try {
            const payload = {
                emp_id: empId,
                mood: selectedMood,
                scale,
            };

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/vibemeter`, payload);
            const data = response.data;

            setIsSubmitted(true);

            if(data.status === "duplicate") {
                alert("You have already submitted your mood for today.");
                return;
            }

            if (data.intervention_needed) {
                sessionStorage.setItem("emp_id", data.emp_id);
                router.push(`/sessions/${data.session_id}`);
                              
            } else {
                setNoIntervention(true);
            }
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 md:px-10">
            <div className="w-full max-w-3xl mx-auto">
                {noIntervention ? (
                    <NoIntervention />
                ) : (
                    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
                        How are you feeling today?
                    </h1>
                
                    {moodOptions.map((mood) => {
                        const value = moods[mood];
                        return (
                            <div
                                key={mood}
                                className={`bg-white p-6 sm:p-7 rounded-2xl shadow-lg border-2 cursor-pointer transition-all duration-300 
                                    ${selectedMood === mood
                                    ? "ring-4 ring-blue-500 border-blue-500 transform scale-105"
                                    : value ? "border-green-500" : "border-gray-200"
                                    }`}
                                onClick={() => handleMoodSelect(mood)}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xl font-semibold text-gray-800">
                                        {mood}
                                    </span>
                                </div>
                
                                {selectedMood === mood && (
                                    <div className="flex gap-4 mt-4 flex-wrap justify-center">
                                        {[1, 2, 3, 4, 5, 6].map((rating) => (
                                            <button
                                                key={rating}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMoodChange(mood, rating);
                                                }}
                                                disabled={isSubmitted}
                                                className={`w-14 h-14 mx-2 rounded-full text-lg font-semibold transition duration-200 
                                                    ${value === rating
                                                        ? "bg-blue-600 text-white shadow-lg scale-110"
                                                        : "bg-gray-200 hover:bg-gray-300 text-gray-800 hover:scale-105"
                                                    } 
                                                    ${isSubmitted ? "cursor-not-allowed opacity-50" : ""}`}
                                            >
                                                {rating}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                
                    <button
                        onClick={handleSubmit}
                        disabled={loading || isSubmitted}
                        className="w-full mt-6 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition disabled:bg-gray-400"
                    >
                        {loading ? "Submitting..." : "Submit Mood"}
                    </button>
                </div>
                
                )}
            </div>
        </div>
    );
}
