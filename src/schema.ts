import { unique } from "drizzle-orm/pg-core";
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
    profile_picture: varchar({ length: 255 }),
    about_me: varchar({ length: 255 }),
    banner: varchar({ length: 255 }),
    status: varchar({ length: 50 }),
    personal_website: varchar({ length: 255 }),
    github: varchar({ length: 255 }),
    linkedin: varchar({ length: 255 }),
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
    content: text().notNull(),
    is_ai_generated: boolean().notNull().default(false),
    up_vote: integer().notNull(),
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

export const threadUpvotesTable = pgTable(
  "thread_upvotes",
  {
    thread_upvote_id: serial("thread_upvote_id").primaryKey(),
    thread_id: integer("thread_id")
      .notNull()
      .references(() => threadsTable.thread_id),
    user_id: integer("user_id")
      .notNull()
      .references(() => usersTable.user_id),
    created_at: timestamp("created_at", { mode: "date" })
      .notNull()
      .defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    uniqueThreadUser: unique("unique_thread_user").on(
      table.thread_id,
      table.user_id
    ),
  })
);

// Define Insert and Select types
export type InsertThreadUpvote = typeof threadUpvotesTable.$inferInsert;
export type SelectThreadUpvote = typeof threadUpvotesTable.$inferSelect;

export const subthreadUpvotesTable = pgTable(
  "subthread_upvotes",
  {
    subthread_upvote_id: serial("subthread_upvote_id").primaryKey(),
    subthread_id: integer("subthread_id")
      .notNull()
      .references(() => subThreadsTable.subthread_id),
    user_id: integer("user_id")
      .notNull()
      .references(() => usersTable.user_id),
    created_at: timestamp("created_at", { mode: "date" })
      .notNull()
      .defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    uniqueSubthreadUser: unique("unique_subthread_user").on(
      table.subthread_id,
      table.user_id
    ),
  })
);

export type InsertSubthreadUpvote = typeof subthreadUpvotesTable.$inferInsert;
export type SelectSubthreadUpvote = typeof subthreadUpvotesTable.$inferSelect;