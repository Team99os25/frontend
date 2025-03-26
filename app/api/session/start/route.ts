import createDB from "@/db";
import { users, wellbeing_messages, wellbeing_sessions } from "@/db/schema";
import { LLMCallService } from "@/lib/llm-service";
import { EmployeeContext } from "@/types/llm";
import { and, eq, gte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const startSessionSchema = z.object({
    employeeId: z.string().nonempty("Employee ID is required"),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { employeeId } = startSessionSchema.parse(body);

        const db = await createDB();
        const llmService = new LLMCallService();

        // Check if employee exists
        const employeeData = await db
            .select({
                name: users.name,
                role: users.role,
            })
            .from(users)
            .where(eq(users.employeeId, employeeId))
            .then((rows) => rows[0]);

        if (!employeeData) {
            return NextResponse.json(
                { error: "Employee not found" },
                { status: 404 }
            );
        }

        // Create a new session
        const [sessionData] = await db
            .insert(wellbeing_sessions)
            .values({
                employee_id: employeeId,
                is_completed: false,
            })
            .returning({ id: wellbeing_sessions.id });

        if (!sessionData) {
            return NextResponse.json(
                { error: "Failed to create session" },
                { status: 500 }
            );
        }
        // Get sessions from past 10 days
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

        const pastSessions = await db
            .select({
                session_id: wellbeing_sessions.id,
                created_at: wellbeing_sessions.created_at,
                chat_summary: wellbeing_sessions.chat_summary,
                messages: wellbeing_messages,
            })
            .from(wellbeing_sessions)
            .leftJoin(
                wellbeing_messages,
                eq(wellbeing_messages.session_id, wellbeing_sessions.id)
            )
            .where(
                and(
                    eq(wellbeing_sessions.employee_id, employeeId),
                    gte(wellbeing_sessions.created_at, tenDaysAgo)
                )
            )
            .groupBy(wellbeing_sessions.id);

        // Format past sessions for LLM context
        const pastSessionFormatted = pastSessions
            .map((session) => {
                return {
                    date: session.created_at.toISOString().split("T")[0],
                    summary: session.chat_summary,
                    messages: session.messages
                        ? {
                              role: session.messages.role,
                              content: session.messages.content,
                          }
                        : null,
                };
            })
            .filter((session) => session.summary || session.messages);

        // Generate initial message
        const initialMessage = await llmService.generateFirstMessage({
            employeeName: employeeData.name,
            employeeRole: employeeData.role,
            pastSessions: pastSessionFormatted,
        } as EmployeeContext);

        // Save the initial message
        const messageResult = await db.insert(wellbeing_messages).values({
            session_id: sessionData.id,
            role: "assistant",
            content: initialMessage,
        });

        if (!messageResult) {
            return NextResponse.json(
                { error: "Failed to save message" },
                { status: 500 }
            );
        }

        const response = {
            sessionId: sessionData.id,
            initialMessage,
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors.map((e) => e.message).join(", ") },
                { status: 400 }
            );
        }
        console.error("Error starting session:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
