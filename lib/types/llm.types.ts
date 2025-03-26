import { ChatMessage } from "../types";

export type LLMResponseWithFlag = {
    message: string;
    endSession: boolean;
};

export type SummaryParams = {
    chatHistory: ChatMessage[];
    employeeName: string;
    employeeRole: string;
};

export type EscalationAnalysisParams = {
    chatHistory: ChatMessage[];
    summary: string;
    employeeName: string;
    employeeRole: string;
};

export type PastSession = {
    id: string;
    created_at: string;
    chat_summary: string;
    wellbeing_chat_history?: {
        question: string;
        answer: string;
    }[];
};

export type EmployeeContext = {
    employeeName: string;
    employeeRole: string;
    pastSessions?: PastSession[];
    recentVibeScore?: number;
    recentWorkHours?: number;
    recentLeaveDays?: number;
    performanceRating?: string;
    recentAwardType?: string;
};
