import {
    ChatMessage,
    EmployeeContext,
    EscalationAnalysisParams,
    LLMResponseWithFlag,
    SummaryParams,
} from "@/types/llm";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

// Define schemas for function calling
const endSessionSchema = z.object({
    endSession: z
        .boolean()
        .describe(
            "Whether the session should end because all required data points have been collected"
        ),
    reason: z
        .string()
        .describe("Reason why the session should end or continue"),
});

const escalationSchema = z.object({
    escalationNeeded: z.boolean().describe("Whether HR intervention is needed"),
    confidenceScore: z
        .number()
        .min(0)
        .max(1)
        .describe("Confidence in this assessment (0-1)"),
    reason: z.string().describe("Reason for escalation or non-escalation"),
    urgencyLevel: z
        .enum(["LOW", "MEDIUM", "HIGH"])
        .describe("Urgency level if escalation is needed"),
});

// Define tools using zod schemas
const endSessionTool = new DynamicStructuredTool({
    name: "end_session",
    description:
        "Analyze if all required well-being data points have been collected and if the session should end",
    schema: endSessionSchema,
    func: async (input: z.infer<typeof endSessionSchema>) => input,
});

const analyzeEscalationTool = new DynamicStructuredTool({
    name: "analyze_hr_escalation",
    description: "Analyze if the conversation requires HR escalation",
    schema: escalationSchema,
    func: async (input: z.infer<typeof escalationSchema>) => input,
});

export class LLMCallService {
    private llm: ChatGoogleGenerativeAI;
    private endSessionTool = endSessionTool;
    private escalationTool = analyzeEscalationTool;

    constructor() {
        // Initialize LLM with function calling capability
        this.llm = new ChatGoogleGenerativeAI({
            model: process.env.GOOGLE_GENAI_MODEL || "gemini-2.5-pro-exp-03-25",
            temperature: 0.3,
            streaming: false,
            apiKey: process.env.GOOGLE_GENAI_API_KEY,
        });
    }

    async generateFirstMessage(context: EmployeeContext): Promise<string> {
        const systemPrompt = `You are an AI chatbot interacting with ${
            context.employeeName
        }, a ${context.employeeRole}, for a well-being and performance check-in.

Your goal is to ask ONLY relevant questions based on their recent work data and trends.

### **Employee Insights**
- **Vibe Score Trends:** ${context.recentVibeScore || "No data available"}
- **Work Hours Last Week:** ${context.recentWorkHours || "Unknown"}
- **Recent Leaves:** ${context.recentLeaveDays || "No leave taken recently"}
- **Performance Rating:** ${context.performanceRating || "Not available"}
- **Recent Awards:** ${context.recentAwardType || "No recent awards"}

### **Guidelines**
1. **Greet warmly** and make it personal.
2. **Adapt questions based on the data**—focus on performance, work-life balance, or well-being.
3. **Recognize achievements** (awards, promotions).
4. **Be empathetic** and **check for stress/burnout**.
5. **Avoid asking private or personal matters.**
6. **Phrase your messages conversationally,** not like a form.

### **Start with a personalized greeting** based on their trends.`;

        const firstMessagePrompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(systemPrompt),
        ]);

        const chain = firstMessagePrompt
            .pipe(this.llm)
            .pipe(new StringOutputParser());
        return await chain.invoke({});
    }

    async processMessage(
        message: string,
        chatHistory: ChatMessage[]
    ): Promise<LLMResponseWithFlag> {
        const llmWithTools = this.llm.bindTools([this.endSessionTool]);

        const systemPrompt = `You are an AI chatbot conducting a well-being check-in.

Your goals:
1. Build rapport and be empathetic.
2. Gather information about well-being (stress, work satisfaction, work-life balance).
3. Ask relevant follow-up questions.
4. Call the end_session function when you have collected enough data.

Rules:
- Ask only ONE question at a time.
- Be conversational and warm.
- Avoid asking about sensitive personal matters.
- Send short, friendly responses.
- Only call end_session when enough well-being data has been gathered.
- If the employee mentions serious issues (burnout, depression, harassment), respond empathetically.`;

        const messages = this.formatChatHistory(chatHistory);

        const prompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(systemPrompt),
            ...messages,
        ]);

        const chain = prompt.pipe(llmWithTools);
        const response = await chain.invoke(message);

        let endSession = false;
        let messageContent = response.content;

        if (response.tool_calls?.length) {
            const toolCall = response.tool_calls.find(
                (tc) => tc.name === "end_session"
            );
            if (toolCall) {
                const args = toolCall.args as z.infer<typeof endSessionSchema>;
                endSession = args.endSession;
                if (endSession) {
                    messageContent += `\n\nThank you for sharing today. Have a great rest of your day!`;
                }
            }
        }

        return { message: messageContent.toLocaleString(), endSession };
    }

    async generateSummary(params: SummaryParams): Promise<string> {
        const formattedChat = this.formatChatHistory(params.chatHistory);

        const systemPrompt = `Generate a summary of the well-being check-in conversation with ${params.employeeName} (${params.employeeRole}).

**Guidelines:**
1. Summarize key points on well-being, stress, and job satisfaction.
2. REMOVE any personal or sensitive information.
3. Focus on professional aspects only.
4. Be objective and factual.

**Output format (JSON):**
{
  "employeeName": "${params.employeeName}",
  "employeeRole": "${params.employeeRole}",
  "wellbeingScore": 7,
  "mood": "Positive",
  "summary": "The employee is generally satisfied with their job...",
  "mainPoints": ["Feels productive", "Work-life balance improved", "No major concerns"]
}`;

        const prompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(systemPrompt),
            ...formattedChat,
        ]);

        const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());
        return await chain.invoke({});
    }

    async analyzeEscalation(params: EscalationAnalysisParams) {
        const llmWithEscalationTool = this.llm.bindTools([this.escalationTool]);
        const formattedChat = this.formatChatHistory(params.chatHistory);

        const systemPrompt = `Analyze the well-being check-in for ${params.employeeName} (${params.employeeRole}) and determine if HR escalation is needed.

Conversation summary:
${params.summary}

**Considerations:**
1. Severe stress, burnout, depression.
2. Workplace conflicts or harassment.
3. Serious job dissatisfaction or mentions of quitting.
4. Requests for specific help.

Use the analyze_hr_escalation function to provide your assessment.`;

        const prompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(systemPrompt),
            ...formattedChat,
        ]);

        const chain = prompt.pipe(llmWithEscalationTool);
        return await chain.invoke({});
    }

    private formatChatHistory(chatHistory: ChatMessage[]) {
        return chatHistory.map((msg) =>
            msg.role === "user"
                ? HumanMessagePromptTemplate.fromTemplate(msg.content)
                : SystemMessagePromptTemplate.fromTemplate(
                      `Assistant: ${msg.content}`
                  )
        );
    }
}
