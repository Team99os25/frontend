import React from 'react';

const NoIntervention: React.FC = () => {
    return (
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
                        You&apos;re Doing Great!
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
    );
};

export default NoIntervention;