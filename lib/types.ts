export type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};

export type PastSessionSummary = {
    date: string;
    summary: string;
};

export interface SessionCheckResponse {
    sessionId?: string;
    created_at?: string;
    messages?: ChatMessage[];
    pastSessionSummaries?: PastSessionSummary[];
    newSession?: boolean;
    initialMessage?: string;
}

export interface NewSessionResponse {
    sessionId: string;
    initialMessage: string;
}

export interface SessionMessageRequest {
    sessionId: string;
    employeeId: string;
    message: string;
    chatHistory: ChatMessage[];
    pastSessions?: PastSessionSummary[];
}

export interface SessionMessageResponse {
    response: string;
    endSession: boolean;
}

export interface EmployeeData {
    id: string;
    e_name: string;
    e_role: string;
    email: string;
}

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
