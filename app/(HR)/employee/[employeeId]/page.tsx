'use client'

import { useState, use } from 'react'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format } from 'date-fns'

// Types
interface Session {
    id: string
    title: string
    summary: string
    date: string
    escalationReasons: string[]
}

interface Employee {
    id: string
    name: string
    lastSessionDate: string
    vulnerabilityScore: number
    sessions: Session[]
}

// Mock API call - Replace with your actual API endpoint
const fetchEmployeeData = async (id: string): Promise<Employee> => {
    // Replace this with your actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id,
                name: "John Doe",
                lastSessionDate: "2024-04-07",
                vulnerabilityScore: 7.5,
                sessions: [
                    {
                        id: "1",
                        title: "Weekly Check-in",
                        summary: "Employee expressed concerns about work-life balance. Mentioned increasing workload and difficulty managing deadlines. Shows signs of stress and burnout.",
                        date: "2024-04-07",
                        escalationReasons: [
                            "High stress levels",
                            "Work-life balance issues",
                            "Potential burnout risk"
                        ]
                    },
                    {
                        id: "2",
                        title: "Weekly Check-in",
                        summary: "Employee expressed concerns about work-life balance. Mentioned increasing workload and difficulty managing deadlines. Shows signs of stress and burnout.",
                        date: "2024-04-07",
                        escalationReasons: [
                            "High stress levels",
                            "Work-life balance issues",
                            "Potential burnout risk"
                        ]
                    },
                    {
                        id: "3",
                        title: "Weekly Check-in",
                        summary: "Employee expressed concerns about work-life balance. Mentioned increasing workload and difficulty managing deadlines. Shows signs of stress and burnout.",
                        date: "2024-04-07",
                        escalationReasons: [
                            "High stress levels",
                            "Work-life balance issues",
                            "Potential burnout risk"
                        ]
                    },
                    {
                        id: "4",
                        title: "Weekly Check-in",
                        summary: "Employee expressed concerns about work-life balance. Mentioned increasing workload and difficulty managing deadlines. Shows signs of stress and burnout.",
                        date: "2024-04-07",
                        escalationReasons: [
                            "High stress levels",
                            "Work-life balance issues",
                            "Potential burnout risk"
                        ]
                    },
                    {
                        id: "5",
                        title: "Weekly Check-in",
                        summary: "Employee expressed concerns about work-life balance. Mentioned increasing workload and difficulty managing deadlines. Shows signs of stress and burnout.",
                        date: "2024-04-07",
                        escalationReasons: [
                            "High stress levels",
                            "Work-life balance issues",
                            "Potential burnout risk"
                        ]
                    },
                    // Add more mock sessions as needed
                ]
            })
        }, 1000)
    })
}

// Circular Progress Component
const CircularProgress = ({ value }: { value: number }) => {
    const radius = 50
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (value / 10) * circumference

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
    )
}

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
    const resolvedParams = use(params)
    const [employee, setEmployee] = useState<Employee | null>(null)
    const [selectedSession, setSelectedSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    // Fetch employee data on component mount
    useState(() => {
        const loadData = async () => {
            try {
                const data = await fetchEmployeeData(resolvedParams.employeeId)
                setEmployee(data)
            } catch (error) {
                console.error('Error fetching employee data:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    })

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 text-white">Loading...</div>
    }

    if (!employee) {
        return <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 text-white">Employee not found</div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="bg-slate-800 rounded-lg shadow-xl p-6 mb-8 border border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 text-white">{employee.name}</h1>
                            <p className="text-slate-300 mb-2">Employee ID: {employee.id}</p>
                            <p className="text-slate-300">
                                Last Session: {format(new Date(employee.lastSessionDate), 'MMM d, yyyy')}
                            </p>
                        </div>
                        <div className="flex justify-center md:justify-end items-center">
                            <div className="text-center">
                                <p className="text-slate-300 mb-2">Vulnerability Score</p>
                                <CircularProgress value={employee.vulnerabilityScore} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sessions Grid */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 text-white">Sessions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {employee.sessions.map((session) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                onClick={() => setSelectedSession(session)}
                            />
                        ))}
                    </div>
                </div>

                {/* Session Details Modal */}
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
                                        {selectedSession.escalationReasons.map((reason, index) => (
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
    )
}

export default Page