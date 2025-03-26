import {
    pgTable,
    text,
    uuid,
    timestamp,
    boolean,
    index,
    integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./auth";

export const wellbeing_sessions = pgTable(
    "wellbeing_session",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        employee_id: text("employee_id")
            .notNull()
            .references(() => users.id),
        created_at: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        is_completed: boolean("is_completed").default(false),
        chat_summary: text("chat_summary"),
    },
    (table) => ({
        employeeIdx: index("idx_wellbeing_session_employee").on(
            table.employee_id
        ),
        dateIdx: index("idx_wellbeing_session_date").on(table.created_at),
    })
);

export const wellbeing_messages = pgTable(
    "wellbeing_message",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        session_id: uuid("session_id")
            .notNull()
            .references(() => wellbeing_sessions.id, { onDelete: "cascade" }),
        role: text("role", { enum: ["user", "assistant"] }).notNull(),
        content: text("content").notNull(),
        timestamp: timestamp("timestamp", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        sessionIdx: index("idx_wellbeing_message_session").on(table.session_id),
        timestampIdx: index("idx_wellbeing_message_timestamp").on(
            table.timestamp
        ),
    })
);

// Define relationships
export const wellbeingSessionsRelations = relations(
    wellbeing_sessions,
    ({ one, many }) => ({
        employee: one(users, {
            fields: [wellbeing_sessions.employee_id],
            references: [users.id],
        }),
        messages: many(wellbeing_messages),
    })
);

export const wellbeingMessagesRelations = relations(
    wellbeing_messages,
    ({ one }) => ({
        session: one(wellbeing_sessions, {
            fields: [wellbeing_messages.session_id],
            references: [wellbeing_sessions.id],
        }),
    })
);

// Analytics tables
export const wellbeing_analytics = pgTable("wellbeing_analytics", {
    id: uuid("id").primaryKey().defaultRandom(),
    employee_id: text("employee_id")
        .notNull()
        .references(() => users.id),
    session_id: uuid("session_id").references(() => wellbeing_sessions.id),
    mood_score: integer("mood_score").notNull(),
    stress_level: text("stress_level"),
    engagement_score: text("engagement_score"),
    date: timestamp("date", { withTimezone: true }).defaultNow().notNull(),
    additional_data: text("additional_data"),
});

export const escalation_flags = pgTable("escalation_flags", {
    id: uuid("id").primaryKey().defaultRandom(),
    session_id: uuid("session_id")
        .notNull()
        .references(() => wellbeing_sessions.id),
    employee_id: text("employee_id")
        .notNull()
        .references(() => users.id),
    flag_type: text("flag_type").notNull(), // e.g., 'burnout', 'mental_health', 'conflict'
    severity: text("severity", { enum: ["LOW", "MEDIUM", "HIGH"] }).notNull(),
    description: text("description"),
    is_resolved: boolean("is_resolved").default(false),
    created_at: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    resolved_at: timestamp("resolved_at", { withTimezone: true }),
    resolved_by: text("resolved_by").references(() => users.id),
    notes: text("notes"),
});
