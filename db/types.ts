import { InferSelectModel } from "drizzle-orm";
import {
    users,
    sessions,
    password_reset_tokens,
    wellbeing_sessions,
    wellbeing_messages,
    wellbeing_analytics,
    escalation_flags,
} from "./schema";

// Auth types
export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
export type PasswordResetToken = InferSelectModel<typeof password_reset_tokens>;

// Wellbeing types
export type WellbeingSession = InferSelectModel<typeof wellbeing_sessions>;
export type WellbeingMessage = InferSelectModel<typeof wellbeing_messages>;
export type WellbeingAnalytics = InferSelectModel<typeof wellbeing_analytics>;
export type EscalationFlag = InferSelectModel<typeof escalation_flags>;
