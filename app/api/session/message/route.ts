import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { LLMCallService } from "@/lib/llm-service";
import {
    ChatMessage,
    SessionMessageRequest,
    SessionMessageResponse,
} from "@/lib/types";

export async function POST(req: NextRequest) {
    try {
        const {
            sessionId,
            employeeId,
            message,
            chatHistory,
        }: SessionMessageRequest = await req.json();

        if (!sessionId || !employeeId || !message || !chatHistory) {
            return NextResponse.json(
                {
                    error: "Session ID, employee ID, message, and chat history are required",
                },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const llmService = new LLMCallService();

        // Verify session belongs to employee
        const { data: sessionData, error: sessionError } = await supabase
            .from("wellbeing_session")
            .select("id, is_completed")
            .eq("id", sessionId)
            .eq("employee_id", employeeId)
            .single();

        if (sessionError || !sessionData) {
            return NextResponse.json(
                { error: "Session not found or access denied" },
                { status: 404 }
            );
        }

        if (sessionData.is_completed) {
            return NextResponse.json(
                { error: "Session is already completed" },
                { status: 400 }
            );
        }

        // Save user message
        const { error: userMessageError } = await supabase
            .from("wellbeing_message")
            .insert({
                session_id: sessionId,
                role: "user",
                content: message,
            });

        if (userMessageError) {
            return NextResponse.json(
                { error: "Failed to save user message" },
                { status: 500 }
            );
        }

        // Update chat history with the new user message
        const updatedChatHistory: ChatMessage[] = [
            ...chatHistory,
            { role: "user", content: message },
        ];

        // Process message with LLM
        const llmResponse = await llmService.processMessage(updatedChatHistory);

        // Save AI response
        const { error: aiMessageError } = await supabase
            .from("wellbeing_message")
            .insert({
                session_id: sessionId,
                role: "assistant",
                content: llmResponse.message,
            });

        if (aiMessageError) {
            return NextResponse.json(
                { error: "Failed to save AI response" },
                { status: 500 }
            );
        }

        // If this is the end of the session, mark it as completed and generate summary
        if (llmResponse.endSession) {
            // Get employee data for summary generation
            const { data: employeeData } = await supabase
                .from("employee")
                .select("e_name, e_role")
                .eq("e_id", employeeId)
                .single();

            // Add AI's final response to chat history
            const finalChatHistory: ChatMessage[] = [
                ...updatedChatHistory,
                { role: "assistant", content: llmResponse.message },
            ];

            // Generate summary
            const summary = await llmService.generateSummary({
                chatHistory: finalChatHistory,
                employeeName: employeeData?.e_name || "Employee",
                employeeRole: employeeData?.e_role || "Unknown",
            });

            // Update session with summary and mark as completed
            await supabase
                .from("wellbeing_session")
                .update({
                    is_completed: true,
                    chat_summary: summary,
                })
                .eq("id", sessionId);
        }

        const response: SessionMessageResponse = {
            response: llmResponse.message,
            endSession: llmResponse.endSession,
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
        console.error("Error processing message:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
