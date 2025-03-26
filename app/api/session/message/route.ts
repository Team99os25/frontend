import createDB from "@/db";
import { users, wellbeing_messages, wellbeing_sessions } from "@/db/schema";
import { LLMCallService } from "@/lib/llm-service";
import { ChatMessage } from "@/types/llm";
import { and, asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const SessionMessageRequestSchema = z.object({
    sessionId: z.string().uuid(),
    employeeId: z.string().min(1),
    message: z.string().min(1),
});

export async function POST(req: NextRequest) {
    try {
        // Parse and validate the request body
        const result = SessionMessageRequestSchema.safeParse(await req.json());

        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Invalid request data",
                    details: result.error.format(),
                },
                { status: 400 }
            );
        }

        const { sessionId, employeeId, message } = result.data;

        const llmService = new LLMCallService();
        const db = await createDB();

        // Verify session belongs to employee
        const sessionData = await db.query.wellbeing_sessions.findFirst({
            where: and(
                eq(wellbeing_sessions.id, sessionId),
                eq(wellbeing_sessions.employee_id, employeeId)
            ),
        });

        if (!sessionData) {
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

        // Get chat history
        const chatHistory = await db
            .select({
                role: wellbeing_messages.role,
                content: wellbeing_messages.content,
            })
            .from(wellbeing_messages)
            .where(eq(wellbeing_messages.session_id, sessionId))
            .orderBy(asc(wellbeing_messages.timestamp));

        // Save user message
        await db.insert(wellbeing_messages).values({
            session_id: sessionId,
            role: "user",
            content: message,
        });

        // Update chat history with the new user message
        const updatedChatHistory = [
            ...chatHistory,
            { role: "user", content: message },
        ] as ChatMessage[];

        // Process message with LLM
        const llmResponse = await llmService.processMessage(
            message,
            updatedChatHistory
        );

        // Save AI response
        await db.insert(wellbeing_messages).values({
            session_id: sessionId,
            role: "assistant",
            content: llmResponse.message,
        });

        // If this is the end of the session, mark it as completed and generate summary
        if (llmResponse.endSession) {
            // Get employee data for summary generation
            const [employeeData] = await db
                .select({
                    name: users.name,
                    role: users.role,
                })
                .from(users)
                .where(eq(users.id, employeeId));

            // Add AI's final response to chat history
            const finalChatHistory = [
                ...updatedChatHistory,
                { role: "assistant", content: llmResponse.message },
            ] as ChatMessage[];

            // Generate summary
            const summary = await llmService.generateSummary({
                chatHistory: finalChatHistory,
                employeeName: employeeData.name,
                employeeRole: employeeData.role,
            });

            // Update session with summary and mark as completed
            await db
                .update(wellbeing_sessions)
                .set({
                    is_completed: true,
                    chat_summary: summary,
                })
                .where(eq(wellbeing_sessions.id, sessionId));
        }

        return NextResponse.json(
            {
                response: llmResponse.message,
                endSession: llmResponse.endSession,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error processing message:", error);
        return NextResponse.json(
            { error: "Internal server error", message: error.message },
            { status: 500 }
        );
    }
}
