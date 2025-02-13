"use server";

import { db } from "@/db";
import { categoriesTable, InsertThread, subThreadsTable, threadCategoriesTable, threadsTable, usersTable } from "@/schema";
import { and, eq, inArray, sql } from "drizzle-orm";

interface Thread {
  thread_id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: number;
  username: string;
  up_vote: number;
  sub_thread_count: number;
  categories: string[];
}

export async function createThread(
  user_id: number,
  title: string,
  content: string,
  thread_type: string,
  up_vote: number,
  categoryNames: string[]
): Promise<void> {
  const newThread = await db.insert(threadsTable).values({
    user_id:user_id,
    title:title,
    content:content,
    thread_type:thread_type,
    up_vote:up_vote
  }).returning({ thread_id: threadsTable.thread_id })

  const threadId = newThread[0].thread_id;

   const categoryIds = await db
    .select({ category_id: categoriesTable.category_id })
    .from(categoriesTable)
    .where(inArray(categoriesTable.category_name, categoryNames));

  await db.insert(threadCategoriesTable).values(
    categoryIds.map(cat => ({ thread_id: threadId, category_id: cat.category_id }))
  );

  }

  // Wihout Filtering
// export async function getAllThreadsWithCategories(page: number = 1, limit: number = 10, selectedCategories: string[] = []) {
//   const offset = (page - 1) * limit; // ✅ Calculate offset based on page

//   const result = await db
//     .select({
//       thread_id: threadsTable.thread_id,
//       title: threadsTable.title,
//       content: threadsTable.content,
//       created_at: threadsTable.created_at,
//       user_id: threadsTable.user_id,
//       username: usersTable.username,
//       up_vote: threadsTable.up_vote,
//       category_name: categoriesTable.category_name,
//       sub_thread_count: sql<number>`COUNT(${subThreadsTable.subthread_id})`.as("sub_thread_count"),
//     })
//     .from(threadsTable)
//     .leftJoin(threadCategoriesTable, eq(threadsTable.thread_id, threadCategoriesTable.thread_id))
//     .leftJoin(categoriesTable, eq(threadCategoriesTable.category_id, categoriesTable.category_id))
//     .leftJoin(subThreadsTable, eq(threadsTable.thread_id, subThreadsTable.thread_id))
//     .leftJoin(usersTable, eq(threadsTable.user_id, usersTable.user_id)).where(
//       selectedCategories.length > 0
//         ? inArray(categoriesTable.category_name, selectedCategories) // ✅ Same filtering applied here
//         : undefined
//     )
//     .groupBy(
//       threadsTable.thread_id,
//       threadsTable.title,
//       threadsTable.content,
//       threadsTable.created_at,
//       threadsTable.user_id,
//       usersTable.username,
//       threadsTable.up_vote,
//       categoriesTable.category_name
//     )
//     .limit(limit)
//     .offset(offset);
    

//   const totalThreads = selectedCategories.length == 0? await db
//     .select({ count: sql<number>`COUNT(*)` })
//     .from(threadsTable)
//     .then(res => res[0]?.count || 0):result.length;
//     console.log(totalThreads)

//   const threadsMap = new Map();

//   result.forEach((row) => {
//     const threadId = row.thread_id;
//     if (!threadsMap.has(threadId)) {
//       threadsMap.set(threadId, {
//         thread_id: row.thread_id,
//         title: row.title,
//         content: row.content,
//         created_at: row.created_at.toISOString(),
//         user_id: row.user_id,
//         username: row.username,
//         up_vote: row.up_vote,
//         sub_thread_count: row.sub_thread_count,
//         categories: [],
//       });
//     }

//     if (row.category_name) {
//       threadsMap.get(threadId).categories.push(row.category_name);
//     }
//   });

//   return {
//     threads: Array.from(threadsMap.values()),
//     total_count: totalThreads, // ✅ Return total count for pagination
//     total_pages: Math.ceil(totalThreads / limit), // ✅ Calculate total pages
//     current_page: page,
//   };
// }

// With Filtering
export async function getAllThreadsWithCategories(
  page: number = 1,
  limit: number = 10,
  selectedCategoryIds: number[] = [] // ✅ Change type to `number[]` for category IDs
) {
  const offset = (page - 1) * limit;

  // ✅ Step 1: Get matching thread IDs based on `category_id`
  const matchingThreadIdsQuery = db
    .select({ thread_id: threadsTable.thread_id })
    .from(threadsTable)
    .leftJoin(threadCategoriesTable, eq(threadsTable.thread_id, threadCategoriesTable.thread_id))
    .leftJoin(categoriesTable, eq(threadCategoriesTable.category_id, categoriesTable.category_id))
    .where(
      selectedCategoryIds.length > 0
        ? inArray(categoriesTable.category_id, selectedCategoryIds) // ✅ Now filtering by category ID
        : undefined
    )
    .groupBy(threadsTable.thread_id);

  const matchingThreadIds = await matchingThreadIdsQuery;
  const threadIds = matchingThreadIds.map(row => row.thread_id);

  // ✅ Step 2: If no matching threads, return empty response
  if (selectedCategoryIds.length > 0 && matchingThreadIds.length === 0) {
    return { threads: [], total_count: 0, total_pages: 0, current_page: page };
  }

  // ✅ Step 3: Count total matching threads
  const totalThreads = threadIds.length;

  // ✅ Step 4: Fetch paginated thread data
  const result = await db
    .select({
      thread_id: threadsTable.thread_id,
      title: threadsTable.title,
      content: threadsTable.content,
      created_at: threadsTable.created_at,
      user_id: threadsTable.user_id,
      username: usersTable.username,
      up_vote: threadsTable.up_vote,
      sub_thread_count: sql<number>`COUNT(${subThreadsTable.subthread_id})`.as("sub_thread_count"),
      categories: sql<string[]>`ARRAY_AGG(DISTINCT ${categoriesTable.category_name}) FILTER (WHERE ${categoriesTable.category_name} IS NOT NULL)`.as("categories") // ✅ Keep all categories
    })
    .from(threadsTable)
    .leftJoin(threadCategoriesTable, eq(threadsTable.thread_id, threadCategoriesTable.thread_id))
    .leftJoin(categoriesTable, eq(threadCategoriesTable.category_id, categoriesTable.category_id))
    .leftJoin(subThreadsTable, eq(threadsTable.thread_id, subThreadsTable.thread_id))
    .leftJoin(usersTable, eq(threadsTable.user_id, usersTable.user_id))
    .where(threadIds.length > 0 ? inArray(threadsTable.thread_id, threadIds) : undefined) // ✅ Keep all categories for matching threads
    .groupBy(
      threadsTable.thread_id,
      threadsTable.title,
      threadsTable.content,
      threadsTable.created_at,
      threadsTable.user_id,
      usersTable.username,
      threadsTable.up_vote
    )
    .limit(limit)
    .offset(offset);

  return {
    threads: result.map((row) => ({
      thread_id: row.thread_id,
      title: row.title,
      content: row.content,
      created_at: row.created_at.toISOString(),
      user_id: row.user_id,
      username: row.username,
      up_vote: row.up_vote,
      sub_thread_count: row.sub_thread_count,
      categories: row.categories || [], // ✅ Show all categories even when filtering
    })),
    total_count: totalThreads, // ✅ Return correct total count
    total_pages: Math.ceil(totalThreads / limit),
    current_page: page,
  };
}

