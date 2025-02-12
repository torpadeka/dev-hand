import {
    boolean,
    char,
    text,
    timestamp, 
    integer,
    pgTable,
    serial,
    varchar,
} from "drizzle-orm/pg-core";
import { number } from "zod";

export const usersTable = pgTable("users", {
    user_id: serial().primaryKey(),
    username: varchar({ length: 100 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }),
    is_expert: boolean().notNull().default(false),
    created_at: timestamp({ mode: "date" }).notNull().defaultNow(),
    updated_at: timestamp({ mode: "date" })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export const userProfilesTable = pgTable("userprofiles", {
    user_id: serial().primaryKey(),
    profile_picture: varchar({ length: 255 }).notNull(),
    about_me: varchar({ length: 255 }).notNull(),
    banner: varchar({ length: 255 }).notNull(),
    status: varchar({ length: 50 }).notNull(),
    personal_website: varchar({ length: 255 }).notNull(),
    github: varchar({ length: 255 }).notNull(),
    linkedin: varchar({ length: 255 }).notNull(),
    total_replies_posted: integer(),
    total_badges_posted: integer(),
    total_threads_posted: integer(),
});

export type InsertUserProfile = typeof userProfilesTable.$inferInsert;
export type SelectUserProfile = typeof userProfilesTable.$inferSelect;

export const badgesTable = pgTable("badges", {
    badge_id: serial().primaryKey(),
    badge_name: varchar({ length: 50 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    criteria: varchar({ length: 255 }).notNull(),
    created_at: timestamp({ mode: "date" }).notNull().defaultNow(),
    updated_at: timestamp({ mode: "date" })
        .notNull()
        .$onUpdate(() => new Date()),
});

export type InsertPost = typeof badgesTable.$inferInsert;
export type SelectPost = typeof badgesTable.$inferSelect;

export const userBadgesTable = pgTable("userbadges", {
    user_id: serial()
        .primaryKey()
        .references(() => usersTable.user_id),
    badge_id: serial().references(() => badgesTable.badge_id),
    awarded_at: timestamp({ mode: "date" }).notNull().defaultNow(),
});

export type InsertUserBadge = typeof userBadgesTable.$inferInsert;
export type SelectUserBadge = typeof userBadgesTable.$inferSelect;

export const subscriptionsTable = pgTable("subscriptions", {
    subscription_id: serial().primaryKey(),
    user_id: integer()
        .notNull()
        .references(() => usersTable.user_id),
    subscription_type: varchar({ length: 10 }).notNull(),
    start_date: timestamp({ mode: "date" }).notNull().defaultNow(),
    end_date: timestamp({ mode: "date" }).notNull(),
    status: varchar({ length: 10 }).notNull(),
    created_at: timestamp({ mode: "date" }).notNull().defaultNow(),
    updated_at: timestamp({ mode: "date" })
        .notNull()
        .$onUpdate(() => new Date()),
});

export type InsertSubscription = typeof subscriptionsTable.$inferInsert;
export type SelectSubscription = typeof subscriptionsTable.$inferSelect;

export const threadsTable = pgTable("threads", {
    thread_id: serial().primaryKey(),
    user_id: integer()
        .notNull()
        .references(() => usersTable.user_id),
    title: varchar({ length: 255 }).notNull(),
    content: text().notNull(),
    thread_type: varchar({ length: 10 }).notNull(),
    up_vote: integer().notNull(),
    created_at: timestamp({ mode: "date" }).notNull().defaultNow(),
    updated_at: timestamp({ mode: "date" })
        .notNull()
        .$onUpdate(() => new Date()),
});

export type InsertThread = typeof threadsTable.$inferInsert;
export type SelectThread = typeof threadsTable.$inferSelect;

export const categoriesTable = pgTable("categories", {
    category_id: serial().primaryKey(),
    category_name: varchar({ length: 100 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    created_at: timestamp({ mode: "date" }).notNull().defaultNow(),
    updated_at: timestamp({ mode: "date" })
        .notNull()
        .$onUpdate(() => new Date()),
});

export type InsertCategory = typeof categoriesTable.$inferInsert;
export type SelectCategory = typeof categoriesTable.$inferSelect;

export const threadCategoriesTable = pgTable("threadcategories", {
    thread_id: integer().references(() => threadsTable.thread_id),
    category_id: integer().references(() => categoriesTable.category_id),
});

export type InsertThreadCategory = typeof threadCategoriesTable.$inferInsert;
export type SelectThreadCategory = typeof threadCategoriesTable.$inferSelect;

export const subThreadsTable = pgTable("subthreads", {
    subthread_id: serial().primaryKey(),
    thread_id: integer()
        .notNull()
        .references(() => threadsTable.thread_id),
    user_id: integer().references(() => usersTable.user_id),
    title: varchar({ length: 255 }).notNull(),
    content: text().notNull(),
    is_ai_generated: boolean().notNull().default(false),
    created_at: timestamp({ mode: "date" }).notNull().defaultNow(),
    updated_at: timestamp({ mode: "date" })
        .notNull()
        .$onUpdate(() => new Date()),
});

export type InsertSubThread = typeof subThreadsTable.$inferInsert;
export type SelectSubThread = typeof subThreadsTable.$inferSelect;

export const repliesTable = pgTable("replies", {
    reply_id: serial().primaryKey(),
    subthread_id: integer()
        .notNull()
        .references(() => subThreadsTable.subthread_id),
    user_id: integer()
        .notNull()
        .references(() => usersTable.user_id),
    content: text().notNull(),
    created_at: timestamp({ mode: "date" }).notNull(),
    updated_at: timestamp({ mode: "date" })
        .notNull()
        .$onUpdate(() => new Date()),
});

export type InsertReply = typeof repliesTable.$inferInsert;
export type SelectReply = typeof repliesTable.$inferSelect;
