// Chat-related Types
export type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};

export type LLMResponseWithFlag = {
    message: string;
    endSession: boolean;
};

// Session-related Types
export type PastSession = {
    date: string;
    summary: string | null;
    messages: {
        role: "user" | "assistant";
        content: string;
    } | null;
};

export interface SessionCheckResponse {
    sessionId?: string;
    created_at?: string;
    messages?: ChatMessage[];
    pastSessions?: { created_at: Date; chat_summary: string | null }[];
    newSession?: boolean;
    initialMessage?: string;
}

export interface SessionMessageRequest {
    sessionId: string;
    employeeId: string;
    message: string;
    chatHistory: ChatMessage[];
    pastSessions?: { created_at: Date; chat_summary: string | null }[];
}

export interface SessionMessageResponse {
    response: string;
    endSession: boolean;
}

// Employee-related Types
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

export interface EmployeeData {
    id: string;
    e_name: string;
    e_role: string;
    email: string;
}

// Wellbeing-related Types
export interface WellbeingSession {
    id: string;
    employee_id: string;
    created_at: string;
    is_completed: boolean;
    chat_summary?: string;
}

export interface WellbeingMessage {
    id: string;
    session_id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
}

// Analysis-related Types
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
