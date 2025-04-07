'use client';
import { useEffect, useState, useRef, use } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

const UserIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const BotIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
);

const SendIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const RefreshIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const ChatIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);



export default function SessionPage() {
    const params = useParams();
    const session_id = params?.session_id as string;
    const [allSessions, setAllSessions] = useState([]);
    const [sessionData, setSessionData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [empId, setEmpId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [introMessages, setIntroMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [conversationCompleted, setConversationCompleted] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
        if (!session_id) return;

        const fetchSession = async () => {
            try {
                const [allSessionsResponse, sessionResponse] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sessions/employee/`, {
                        validateStatus: (status) => {
                            return status < 600;
                        },
                        withCredentials: true,
                    },),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sessions/employee/${session_id}`, {
                        validateStatus: (status) => {
                            return status < 600;
                        },
                        withCredentials: true,
                    },)
                ]);
                console.log('sessionResponse:', sessionResponse.data);

                setAllSessions(allSessionsResponse.data);
                setSessionData(sessionResponse.data);
                if (sessionResponse.data.status === "completed") {
                    setConversationCompleted(true);
                }

                setIntroMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        id: sessionResponse.data.id,
                        sent_by: 'ai',
                        text: sessionResponse.data.initial_conversation,
                        timestamp: new Date(sessionResponse.data.started_at),
                    },
                    {
                        id: prevMessages.length + 1,
                        sent_by: 'ai',
                        text: "Lets gets started for today's session...",
                        timestamp: new Date(),
                    },
                ]);


                try {
                    const messagesResponse = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/conversation/${session_id}`, {
                            validateStatus: (status) => {
                                return status < 600;
                            },
                            withCredentials: true,
                        },
                    );

                    if (messagesResponse.data) {
                        const messagesData = messagesResponse.data.conversations;
                        console.log('Fetched messages:', messagesData);
                        const formattedMessages = messagesData.map((message: any) => ({
                            id: message.id,
                            sent_by: message.sent_by,
                            text: message.conversation,
                            timestamp: new Date(message.created_at),
                        }));

                        setMessages((prevMessages) => [
                            ...prevMessages,
                            ...formattedMessages,
                        ]);
                    } else {
                        console.log('No valid conversations data available.');
                    }
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }

            } catch (err) {
                console.error("Failed to load session:", err);
                setError("Failed to load session. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [session_id, empId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const payload = {
            emp_id: empId,
            text: newMessage,
        };

        setIsSending(true);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/conversation/${session_id}`,
                payload,
                 {
                    validateStatus: (status) => {
                        return status < 600;
                    },
                    withCredentials: true,
                },
            );

            const { user_message, ai_message, status } = response.data;

            if (status === "completed") {
                setConversationCompleted(true);
            }

            const addMessage = (message: typeof user_message) => {
                if (!message) return;
                setMessages(prev => [
                    ...prev,
                    {
                        id: message.id,
                        sent_by: message.sent_by,
                        text: message.text,
                        timestamp: new Date(message.created_at),
                    }
                ]);
            };

            addMessage(user_message);
            addMessage(ai_message);

        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setNewMessage("");
            setIsSending(false);
        }
    };


    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        </div>
    );

    if (!sessionData) return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded max-w-md">
                No session data found.
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 pt-20 min-h-screen">

            {/* left side */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <a
                        href="/sessions"
                        className="flex items-center justify-center space-x-2 px-6 py-3 text-xl font-bold text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                    >
                        <span>
                            <ChatIcon />
                        </span>
                        <span>Sessions</span>
                    </a>

                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                        <ul className="space-y-4">
                            {allSessions.map((session: any) => (
                                <li key={session.id}>
                                    <a
                                        href={`/sessions/${session.id}`}
                                        className={`flex items-center px-6 py-4 rounded-lg border transition-all duration-300 ease-in-out
                        ${session.id === session_id
                                                ? 'bg-white text-gray-900 font-semibold border-gray-300 shadow-md transform hover:scale-102'
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-200 border-gray-200 shadow-sm transform hover:scale-101'}
                        `}
                                    >
                                        <span className="truncate text-lg">{` ${new Date(session.started_at).toLocaleDateString()}`}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="p-4 border-t border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <UserIcon />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">
                                {empId || 'Employee'}
                            </p>
                            <p className="text-xs text-gray-500">Active</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {`Employee Wellbeing Session On ${new Date(sessionData.started_at).toLocaleDateString()}`}
                            </h2>
                        </div>
                        <div
                            className={`inline-flex items-center px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium ${sessionData.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}
                        >
                            <span
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            >
                                {sessionData.status}
                            </span>
                        </div>

                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
                    <div className="max-w-6xl mx-auto space-y-4">
                        <div className="intro-messages-section max-w-5xl mx-auto ">
                            <div className="p-6">
                                {introMessages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`my-6 ${index === 1 ? 'animate-moveRight' : ''}`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="flex justify-center">
                                            <div className="relative max-w-3xl">
                                                <div
                                                    className={`relative inline-block px-8 py-6 rounded-2xl shadow-lg
                                                    bg-gradient-to-r from-blue-50 to-indigo-100
                                                    border border-blue-200
                                                    text-gray-800 before:absolute before:-left-3 before:top-4 before:w-5 before:h-5 
                                                    before:bg-blue-50 before:border-l before:border-b before:border-blue-200
                                                    before:rotate-45 before:rounded-sm`}
                                                >
                                                    <p className="leading-relaxed font-semibold">{message.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>





                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sent_by === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`flex max-w-2xl rounded-lg px-4 py-2 ${message.sent_by === 'user'
                                        ? 'bg-green-100 '
                                        : 'bg-white border border-gray-200  '
                                        }`}
                                >
                                    {message.sent_by === 'ai' && (
                                        <div className="mr-2 mt-0.5 flex-shrink-0">
                                            <BotIcon />
                                        </div>
                                    )}
                                    <div>
                                        <p className="whitespace-pre-wrap">{message.text}</p>
                                        <p className={`text-xs mt-1`}>
                                            {new Date(message.timestamp).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </p>
                                    </div>
                                    {message.sent_by === 'user' && (
                                        <div className="ml-2 mt-0.5 flex-shrink-0">
                                            <UserIcon />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isSending && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 text-gray-800 rounded-lg px-4 py-2 flex items-center">
                                    <div className="mr-2">
                                        <BotIcon />
                                    </div>
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                </div>

                {/* Chat Input */}
                {!conversationCompleted && (

                    <div className="bg-white border-t border-b border-gray-200 p-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex rounded-md shadow-sm">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 block w-full rounded-none rounded-l-md pl-4 py-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-green-100"
                                    placeholder="Type your message..."
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim() || isSending}
                                    className={`inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md shadow-sm text-sm font-medium text-white ${!newMessage.trim() || isSending
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                        }`}
                                >
                                    <SendIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}