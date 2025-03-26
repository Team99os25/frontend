import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { LLMCallService } from "@/lib/llm-service";
import {
    ChatMessage,
    PastSessionSummary,
    SessionCheckResponse,
} from "@/lib/types";

export async function GET(
    req: NextRequest,
    { params }: { params: { employeeId: string } }
) {
    try {
        const employeeId = params.employeeId;
        if (!employeeId) {
            return NextResponse.json(
                { error: "Employee ID is required" },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const llmService = new LLMCallService();

        // Get today's date in YYYY-MM-DD format (UTC)
        const today = new Date().toISOString().split("T")[0];

        // Check if employee exists
        const { data: employeeData, error: employeeError } = await supabase
            .from("employee")
            .select("e_name, e_role")
            .eq("e_id", employeeId)
            .single();

        if (employeeError || !employeeData) {
            return NextResponse.json(
                { error: "Employee not found" },
                { status: 404 }
            );
        }

        // Check if today's session exists
        const { data: sessionData, error: sessionError } = await supabase
            .from("wellbeing_session")
            .select("id, created_at")
            .eq("employee_id", employeeId)
            .gte("created_at", `${today}T00:00:00`)
            .lt("created_at", `${today}T23:59:59`)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        // Fetch past session summaries
        const { data: pastSessions, error: pastSessionsError } = await supabase
            .from("wellbeing_session")
            .select("created_at, chat_summary")
            .eq("employee_id", employeeId)
            .lt("created_at", `${today}T00:00:00`)
            .order("created_at", { ascending: false })
            .limit(5);

        const pastSessionSummaries: PastSessionSummary[] =
            pastSessions?.map((session) => ({
                date: new Date(session.created_at).toDateString(),
                summary: session.chat_summary || "No summary available",
            })) || [];

        // If today's session exists, fetch messages
        if (sessionData && sessionData.id) {
            const { data: messagesData, error: messagesError } = await supabase
                .from("wellbeing_message")
                .select("role, content")
                .eq("session_id", sessionData.id)
                .order("timestamp", { ascending: true });

            if (messagesError) {
                return NextResponse.json(
                    { error: "Failed to fetch messages" },
                    { status: 500 }
                );
            }

            const messages: ChatMessage[] =
                messagesData?.map((msg) => ({
                    role: msg.role as "user" | "assistant",
                    content: msg.content,
                })) || [];

            const response: SessionCheckResponse = {
                sessionId: sessionData.id,
                created_at: new Date(sessionData.created_at).toISOString(),
                messages,
                pastSessionSummaries,
            };

            return NextResponse.json(response, { status: 200 });
        } else {
            // No session exists, generate initial message
            const initialMessage = await llmService.generateFirstMessage({
                employeeName: employeeData.e_name,
                employeeRole: employeeData.e_role,
                pastSessions: [],
            });

            const response: SessionCheckResponse = {
                newSession: true,
                initialMessage,
                pastSessionSummaries,
            };

            return NextResponse.json(response, { status: 200 });
        }
    } catch (error: any) {
        console.error("Error in session check:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
