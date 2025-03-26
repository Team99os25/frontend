import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { LLMCallService } from "@/lib/llm-service";
import { NewSessionResponse } from "@/lib/types";
import { EmployeeContext } from "@/lib/types/llm.types";

export async function POST(req: NextRequest) {
    try {
        const { employeeId } = await req.json();

        if (!employeeId) {
            return NextResponse.json(
                { error: "Employee ID is required" },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const llmService = new LLMCallService();

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

        // Create a new session
        const { data: sessionData, error: sessionError } = await supabase
            .from("wellbeing_session")
            .insert({
                employee_id: employeeId,
                is_completed: false,
            })
            .select("id")
            .single();

        if (sessionError || !sessionData) {
            return NextResponse.json(
                { error: "Failed to create session" },
                { status: 500 }
            );
        }

        // Generate initial message
        const initialMessage = await llmService.generateFirstMessage({
            employeeName: employeeData.e_name,
            employeeRole: employeeData.e_role,
            pastSessions: [],
        } as EmployeeContext);

        // Save the initial message
        const { error: messageError } = await supabase
            .from("wellbeing_message")
            .insert({
                session_id: sessionData.id,
                role: "assistant",
                content: initialMessage,
            });

        if (messageError) {
            return NextResponse.json(
                { error: "Failed to save message" },
                { status: 500 }
            );
        }

        const response: NewSessionResponse = {
            sessionId: sessionData.id,
            initialMessage,
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error: any) {
        console.error("Error starting session:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
