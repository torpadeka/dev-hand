"use server";

import { db } from "@/db";
import { categoriesTable, InsertThread, repliesTable, subThreadsTable, subthreadUpvotesTable, threadCategoriesTable, threadsTable, threadUpvotesTable, userProfilesTable, usersTable } from "@/schema";
import { and, desc, eq, inArray, sql } from "drizzle-orm";

export async function createThread(
  user_id: number,
  title: string,
  content: string,
  thread_type: string,
  up_vote: number,
  categoryNames: string[]
): Promise<number> {
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
  return threadId;
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
//     .leftJoin(usersTable, eq(threadsTable.user_id, usersTable.user_id))
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
      up_vote: sql<number>`
        (SELECT COUNT(*) 
         FROM ${threadUpvotesTable} 
         WHERE ${threadUpvotesTable.thread_id} = ${threadsTable.thread_id})
      `.as("up_vote"),
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
      sub_thread_count: row.sub_thread_count/row.categories.length,
      categories: row.categories || [],
    })),
    total_count: totalThreads,
    total_pages: Math.ceil(totalThreads / limit),
    current_page: page,
  };
}

// Get Thread Detail
export async function getThreadDetail(threadId: number) {
  const result = await db
    .select({
      thread_id: threadsTable.thread_id,
      user_id: threadsTable.user_id,
      username: usersTable.username,
      user_profile: userProfilesTable.profile_picture,

      // ✅ Aggregate categories to avoid duplication
      categories: sql<string[]>`ARRAY_AGG(DISTINCT ${categoriesTable.category_name}) FILTER (WHERE ${categoriesTable.category_name} IS NOT NULL)`.as("categories"),

      title: threadsTable.title,
      content: threadsTable.content,
      up_vote: sql<number>`
        (SELECT COUNT(*) 
         FROM ${threadUpvotesTable} 
         WHERE ${threadUpvotesTable.thread_id} = ${threadsTable.thread_id})
      `.as("up_vote"),
      thread_type: threadsTable.thread_type,
      created_at: threadsTable.created_at,
      updated_at: threadsTable.updated_at,

      // ✅ Subthread details
      subthread_id: subThreadsTable.subthread_id,
      subthread_userid: subThreadsTable.user_id,
      subthread_username: sql<string>`(SELECT username FROM ${usersTable} WHERE ${usersTable.user_id} = ${subThreadsTable.user_id})`,
      subthread_is_expert: sql<string>`(SELECT is_expert FROM ${usersTable} WHERE ${usersTable.user_id} = ${subThreadsTable.user_id})`,
      subthread_content: subThreadsTable.content,
      subhtread_up_vote: sql<number>`
        (SELECT COUNT(*) 
         FROM ${subthreadUpvotesTable} 
         WHERE ${subthreadUpvotesTable.subthread_id} = ${subThreadsTable.subthread_id})
      `.as("up_vote"),
      subthread_is_ai_generated: subThreadsTable.is_ai_generated,
      subthread_profile: userProfilesTable.profile_picture,
      subthread_created_at: subThreadsTable.created_at,
      subthread_updated_at: subThreadsTable.updated_at,
    })
    .from(threadsTable)
    .leftJoin(usersTable, eq(threadsTable.user_id, usersTable.user_id))
    .leftJoin(threadCategoriesTable, eq(threadsTable.thread_id, threadCategoriesTable.thread_id))
    .leftJoin(categoriesTable, eq(threadCategoriesTable.category_id, categoriesTable.category_id))
    .leftJoin(subThreadsTable, eq(threadsTable.thread_id, subThreadsTable.thread_id))
    .leftJoin(userProfilesTable, eq(subThreadsTable.user_id, userProfilesTable.user_id))
    .where(eq(threadsTable.thread_id, threadId))
    .groupBy(
      threadsTable.thread_id,
      usersTable.username,
      usersTable.is_expert,
      subThreadsTable.subthread_id,
      subThreadsTable.user_id,
      subThreadsTable.content,
      subThreadsTable.is_ai_generated,
      subThreadsTable.created_at,
      subThreadsTable.updated_at,
      userProfilesTable.profile_picture
    );

  // ✅ Process result without duplicating subthreads
  const uniqueSubthreads = new Map();

  result.forEach(sub => {
    if (sub.subthread_id !== null && !uniqueSubthreads.has(sub.subthread_id)) {
      uniqueSubthreads.set(sub.subthread_id, {
        subthread_id: sub.subthread_id ?? 0,
        user: {
          id: sub.subthread_userid ?? 0,
          username: sub.subthread_username ?? "Unknown",
          profile_picture: sub.user_profile ?? "",
          is_expert: sub.subthread_is_expert ?? false,
        },
        content: sub.subthread_content ?? "No content available.",
        up_vote: sub.subhtread_up_vote ?? 0,
        profile_picture: sub.subthread_profile ?? "",
        is_ai_generated: sub.subthread_is_ai_generated ?? false,
        created_at: sub.subthread_created_at?.toISOString() ?? new Date().toISOString(),
        updated_at: sub.subthread_updated_at?.toISOString() ?? null,
      });
    }
  });

  return {
    thread_id: result[0]?.thread_id ?? 0,
    user: {
      id: result[0]?.user_id ?? 0,
      username: result[0]?.username ?? "Unknown",
      profile_picture: result[0]?.user_profile ?? "",
      is_expert: result[0]?.subthread_is_expert == "TRUE" ? true : false,
    },
    categories: result[0]?.categories ?? [], // ✅ Already aggregated in SQL
    title: result[0]?.title ?? "Untitled Thread",
    content: result[0]?.content ?? "No content available.",
    up_vote: result[0]?.up_vote ?? 0,
    thread_type: result[0]?.thread_type ?? "general",
    created_at: result[0]?.created_at?.toISOString() ?? new Date().toISOString(),
    updated_at: result[0]?.updated_at?.toISOString() ?? null,
    subthreads: Array.from(uniqueSubthreads.values()), // ✅ Prevent duplicate subthreads
  };
}

// Get Reply from subthread
export async function getRepliesForSubthread(subthreadId: number) {
  const result = await db
    .select({
      reply_id: repliesTable.reply_id,
      user_id: repliesTable.user_id,
      username: usersTable.username,
      is_expert: usersTable.is_expert,
      profile_picture: userProfilesTable.profile_picture,
      content: repliesTable.content,
      created_at: repliesTable.created_at,
      updated_at: repliesTable.updated_at,
    })
    .from(repliesTable)
    .leftJoin(usersTable, eq(usersTable.user_id, repliesTable.user_id)) // ✅ JOIN usersTable to get username
    .leftJoin(userProfilesTable, eq(usersTable.user_id, userProfilesTable.user_id)) // ✅ JOIN usersTable to get username
    .where(eq(repliesTable.subthread_id, subthreadId)); // ✅ Filter by single subthread

 return {
  result: result.map(reply => ({
    reply_id: reply.reply_id,
    user: {
      id: reply.user_id ?? null,
      username: reply.username ?? "Unknown",
      is_expert: reply.is_expert ?? false,
      profile_picture: reply.profile_picture ?? "",
    },
    content: reply.content,
    created_at: reply.created_at.toISOString(),
    updated_at: reply.updated_at?.toISOString() || null,
  })),
};
}

// Insert subthreads
export async function createSubThread(threadId: number, userId: number, content: string, is_ai_generated: boolean = false) {
    await db.insert(subThreadsTable).values({
      thread_id: threadId,
      user_id: userId,
      content:content,
      is_ai_generated: is_ai_generated,
      up_vote: 0,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  export async function createReply(
  subthreadId: number,
  userId: number,
  content: string
) {
  await db.insert(repliesTable).values({
    subthread_id: subthreadId,
    user_id: userId,
    content: content,
    created_at: new Date(),
    updated_at: new Date(),
  });
}

  export async function getNewestThreads(limit: number = 10) {
  const result = await db
    .select({
      thread_id: threadsTable.thread_id,
      title: threadsTable.title,
      content: threadsTable.content,
      created_at: threadsTable.created_at,
      user_id: threadsTable.user_id,
      username: usersTable.username,
      up_vote: sql<number>`
        (SELECT COUNT(*) 
         FROM ${threadUpvotesTable} 
         WHERE ${threadUpvotesTable.thread_id} = ${threadsTable.thread_id})
      `.as("up_vote"),
      category_name: categoriesTable.category_name,
      sub_thread_count: sql<number>`COUNT(${subThreadsTable.subthread_id})`.as("sub_thread_count"),
    })
    .from(threadsTable)
    .leftJoin(threadCategoriesTable, eq(threadsTable.thread_id, threadCategoriesTable.thread_id))
    .leftJoin(categoriesTable, eq(threadCategoriesTable.category_id, categoriesTable.category_id))
    .leftJoin(subThreadsTable, eq(threadsTable.thread_id, subThreadsTable.thread_id))
    .leftJoin(usersTable, eq(threadsTable.user_id, usersTable.user_id))
    .groupBy(
      threadsTable.thread_id,
      threadsTable.title,
      threadsTable.content,
      threadsTable.created_at,
      threadsTable.user_id,
      usersTable.username,
      threadsTable.up_vote,
      categoriesTable.category_name
    )
    .orderBy(desc(threadsTable.created_at)) // ✅ Order by newest threads first
    .limit(limit); // ✅ Get only `n` newest threads

  const threadsMap = new Map();

  result.forEach((row) => {
    const threadId = row.thread_id;
    if (!threadsMap.has(threadId)) {
      threadsMap.set(threadId, {
        thread_id: row.thread_id,
        title: row.title,
        content: row.content,
        created_at: row.created_at.toISOString(),
        user_id: row.user_id,
        username: row.username,
        up_vote: row.up_vote,
        sub_thread_count: row.sub_thread_count,
        categories: [],
      });
    }

    if (row.category_name) {
      threadsMap.get(threadId).categories.push(row.category_name);
    }
  });

  return {
    threads: Array.from(threadsMap.values()), // ✅ Return newest threads without category filtering
  };
}

export async function getHotTopicThreads(limit: number = 10) {
  const result = await db
    .select({
      thread_id: threadsTable.thread_id,
      title: threadsTable.title,
      content: threadsTable.content,
      created_at: threadsTable.created_at,
      user_id: threadsTable.user_id,
      username: usersTable.username,
      up_vote: sql<number>`
        (SELECT COUNT(*) 
         FROM ${threadUpvotesTable} 
         WHERE ${threadUpvotesTable.thread_id} = ${threadsTable.thread_id})
      `.as("up_vote"),
      sub_thread_count: sql<number>`COUNT(DISTINCT ${subThreadsTable.subthread_id})`.as("sub_thread_count"), // ✅ Fixed syntax
    })
    .from(threadsTable)
    .leftJoin(subThreadsTable, eq(threadsTable.thread_id, subThreadsTable.thread_id))
    .leftJoin(usersTable, eq(threadsTable.user_id, usersTable.user_id))
    .groupBy(
      threadsTable.thread_id,
      threadsTable.title,
      threadsTable.content,
      threadsTable.created_at,
      threadsTable.user_id,
      usersTable.username,
      threadsTable.up_vote
    )
    .orderBy(desc(sql<number>`COUNT(DISTINCT ${subThreadsTable.subthread_id})`)) // ✅ Corrected ORDER BY
    .limit(limit);

  return {threads: Array.from(result),};
}

