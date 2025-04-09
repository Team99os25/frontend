"use client"

import { useState, useEffect, use } from 'react'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format } from 'date-fns'
import axios from 'axios'

// Types
interface Session {
    session_id: string
    title: string
    summary: string
    date: string
    reasons: string[]
}

interface Employee {
    emp_id: string
    emp_name: string
    current_mood: string
    last_session_date: string
    vulnerability_score: number
    sessions_this_month: number
    latest_activity: {
        date_msg: string
        teams_messages_sent: number
        emails_sent: number
        work_hours: number
    }
    latest_leave: {
        leave_type: string
        leave_days: number
        leave_start_date: string
    }
    latest_performance: {
        performance_rating: number
        manager_feedback: string
        review_period: string
        promotion_consideration: boolean
    }
    latest_reward: {
        reward_points: number
        award_date: string
        award_type: string
    }
}

// Circular Progress Component
const CircularProgress = ({ value }: { value: number }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 10) * circumference;

    return (
        <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
                <circle
                    className="text-slate-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="64"
                    cy="64"
                />
                <circle
                    className="text-blue-400"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="64"
                    cy="64"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{value}</span>
            </div>
        </div>
    );
};

// Session Card Component
const SessionCard = ({ session, onClick }: { session: Session; onClick: () => void }) => {
    return (
        <Card
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow bg-slate-800 border-slate-700 hover:bg-slate-700"
            onClick={onClick}
        >
            <h3 className="font-semibold mb-2 text-white">{session.title}</h3>
            <p className="text-sm text-slate-300 line-clamp-3">
                {session.summary}
            </p>
            <p className="text-xs text-slate-400 mt-2">
                {format(new Date(session.date), 'MMM d, yyyy')}
            </p>
        </Card>
    )
}

const Page = ({ params }: { params: Promise<{ employeeId: string }> }) => {
    const resolvedParams = use(params);
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/hr/employee/${resolvedParams.employeeId}`,
                    { withCredentials: true }
                );
                setEmployee(response.data);
            } catch (error) {
                console.error('Error fetching employee data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [resolvedParams.employeeId]);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/hr/employee/${resolvedParams.employeeId}/escalated-sessions`,
                    { withCredentials: true }
                );
                setSessions(res.data);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };

        fetchSessions();
    }, [resolvedParams.employeeId]);

    if (loading) {
        return <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 p-4">Loading...</div>;
    }

    if (!employee) {
        return <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 p-4">Employee not found</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900">
            <div className="p-4 md:p-6">
                {/* Employee Info Section */}
                <div className="mb-8">
                    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2">{employee.emp_name}</h1>
                                <p className="text-slate-400">ID: {employee.emp_id}</p>
                                <p className="text-slate-400">Current Mood: {employee.current_mood}</p>
                                <p className="text-slate-400">Last Session: {new Date(employee.last_session_date).toLocaleDateString()}</p>
                                <p className="text-slate-400">Sessions This Month: {employee.sessions_this_month}</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <CircularProgress value={employee.vulnerability_score} />
                                <p className="text-slate-400 mt-2 text-center">Vulnerability Score</p>
                            </div>
                        </div>

                        {/* Latest Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {/* Latest Activity */}
                            <div className="bg-slate-700/50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-white mb-2">Latest Activity</h3>
                                <div className="space-y-1">
                                    <p className="text-slate-300">Date: {employee.latest_activity.date_msg}</p>
                                    <p className="text-slate-300">Teams Messages: {employee.latest_activity.teams_messages_sent}</p>
                                    <p className="text-slate-300">Emails Sent: {employee.latest_activity.emails_sent}</p>
                                    <p className="text-slate-300">Work Hours: {employee.latest_activity.work_hours}</p>
                                </div>
                            </div>

                            {/* Latest Leave */}
                            <div className="bg-slate-700/50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-white mb-2">Latest Leave</h3>
                                <div className="space-y-1">
                                    <p className="text-slate-300">Type: {employee.latest_leave.leave_type}</p>
                                    <p className="text-slate-300">Days: {employee.latest_leave.leave_days}</p>
                                    <p className="text-slate-300">Start Date: {new Date(employee.latest_leave.leave_start_date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Latest Performance */}
                            <div className="bg-slate-700/50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-white mb-2">Latest Performance</h3>
                                <div className="space-y-1">
                                    <p className="text-slate-300">Rating: {employee.latest_performance.performance_rating}</p>
                                    <p className="text-slate-300">Feedback: {employee.latest_performance.manager_feedback}</p>
                                    <p className="text-slate-300">Review Period: {employee.latest_performance.review_period}</p>
                                    <p className="text-slate-300">Promotion Consideration: {employee.latest_performance.promotion_consideration ? 'Yes' : 'No'}</p>
                                </div>
                            </div>

                            {/* Latest Reward */}
                            <div className="bg-slate-700/50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-white mb-2">Latest Reward</h3>
                                <div className="space-y-1">
                                    <p className="text-slate-300">Award Points: {employee.latest_reward.reward_points}</p>
                                    <p className="text-slate-300">Award Type: {employee.latest_reward.award_type}</p>
                                    <p className="text-slate-300">Award Date: {employee.latest_reward.award_date}</p>                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sessions Section */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Past Sessions</h2>
                    {sessions.length === 0 ? (
                        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center">
                            <p className="text-slate-400">No past sessions yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sessions.map((session) => (
                                <SessionCard
                                    key={session.session_id}
                                    session={session}
                                    onClick={() => setSelectedSession(session)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Session Details Dialog */}
                <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
                    {selectedSession && (
                        <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-white">{selectedSession.title}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                                <p className="text-slate-300 mb-4">{selectedSession.summary}</p>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-white">Reasons for Escalation:</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {selectedSession.reasons.map((reason, index) => (
                                            <li key={index} className="text-slate-300">{reason}</li>
                                        ))}
                                    </ul>
                                </div>
                                <p className="text-sm text-slate-400 mt-4">
                                    Session Date: {format(new Date(selectedSession.date), 'MMMM d, yyyy')}
                                </p>
                            </div>
                        </DialogContent>
                    )}
                </Dialog>
            </div>
        </div>
    );
};

export default Page