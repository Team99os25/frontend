import { pgTable, text, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoles = pgEnum("role", ["employee", "hr"]);

export const users = pgTable("employee", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    employeeId: text("employee_id").notNull().unique(),
    name: text("name").notNull(),
    role: userRoles().notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: text("user_id")
        .notNull()
        .references(() => users.id),
    expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const password_reset_tokens = pgTable("password_reset_tokens", {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: text("user_id")
        .notNull()
        .references(() => users.id),
    token: text("token").notNull().unique(),
    expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
    passwordResetTokens: many(password_reset_tokens),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.user_id],
        references: [users.id],
    }),
}));

export const passwordResetTokensRelations = relations(
    password_reset_tokens,
    ({ one }) => ({
        user: one(users, {
            fields: [password_reset_tokens.user_id],
            references: [users.id],
        }),
    })
);
