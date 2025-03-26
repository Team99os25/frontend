import createDB from "@/db";
import { users, wellbeing_messages, wellbeing_sessions } from "@/db/schema";
import { LLMCallService } from "@/lib/llm-service";
import { SessionCheckResponse } from "@/types/llm";
import { asc, desc, eq, gte, lt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define validation schema
const paramsSchema = z.object({
    employeeId: z.string().uuid(),
});

export async function GET(
    req: NextRequest,
    { params }: { params: { employeeId: string } }
) {
    try {
        // Validate input
        const validatedParams = paramsSchema.safeParse(params);
        if (!validatedParams.success) {
            return NextResponse.json(
                { error: "Invalid employee ID format" },
                { status: 400 }
            );
        }

        const employeeId = validatedParams.data.employeeId;
        const llmService = new LLMCallService();
        const db = await createDB();

        // Get today's date in YYYY-MM-DD format (UTC)
        const today = new Date().toISOString().split("T")[0];

        // Check if employee exists
        const employeeData = await db.query.users.findFirst({
            where: eq(users.id, employeeId),
            columns: {
                name: true,
                role: true,
            },
        });

        if (!employeeData) {
            return NextResponse.json(
                { error: "Employee not found" },
                { status: 404 }
            );
        }

        // Check if today's session exists
        const todayStart = new Date(`${today}T00:00:00`);
        const todayEnd = new Date(`${today}T23:59:59`);

        const [session] = await db
            .select()
            .from(wellbeing_sessions)
            .where(
                eq(wellbeing_sessions.employee_id, employeeId) &&
                    gte(wellbeing_sessions.created_at, todayStart) &&
                    lt(wellbeing_sessions.created_at, todayEnd)
            )
            .orderBy(desc(wellbeing_sessions.created_at))
            .limit(1);

        // Fetch past session summaries
        const pastSessions = await db
            .select({
                created_at: wellbeing_sessions.created_at,
                chat_summary: wellbeing_sessions.chat_summary,
            })
            .from(wellbeing_sessions)
            .where(
                eq(wellbeing_sessions.employee_id, employeeId) &&
                    lt(wellbeing_sessions.created_at, todayStart)
            )
            .orderBy(desc(wellbeing_sessions.created_at))
            .limit(5);

        // If today's session exists, fetch messages
        if (session) {
            const messages = await db
                .select({
                    role: wellbeing_messages.role,
                    content: wellbeing_messages.content,
                    timestamp: wellbeing_messages.timestamp,
                })
                .from(wellbeing_messages)
                .where(eq(wellbeing_messages.session_id, session.id))
                .orderBy(asc(wellbeing_messages.timestamp));

            const response: SessionCheckResponse = {
                sessionId: session.id,
                created_at: new Date(session.created_at).toISOString(),
                messages,
                pastSessions,
            };

            return NextResponse.json(response, { status: 200 });
        } else {
            // No session exists, send response to hit the /start endpoint
            return NextResponse.json({ newSession: true }, { status: 200 });
        }
    } catch (error: any) {
        console.error("Error in session check:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
