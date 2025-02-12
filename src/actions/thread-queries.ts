"use server";

import { db } from "@/db";
import { categoriesTable, InsertThread, threadCategoriesTable, threadsTable } from "@/schema";
import { and, eq, inArray } from "drizzle-orm";


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

  export async function getAllThreadsWithCategories() {
  const result = await db
    .select({
      thread_id: threadsTable.thread_id,
      title: threadsTable.title,
      content: threadsTable.content,
      created_at: threadsTable.created_at,
      user_id: threadsTable.user_id,
      category_name: categoriesTable.category_name, 
      up_vote: threadsTable.up_vote
    })
    .from(threadsTable)
    .leftJoin(threadCategoriesTable, eq(threadsTable.thread_id, threadCategoriesTable.thread_id))
    .leftJoin(categoriesTable, eq(threadCategoriesTable.category_id, categoriesTable.category_id));

  const threadsMap = new Map();

  result.forEach((row) => {
    const threadId = row.thread_id;
    if (!threadsMap.has(threadId)) {
      threadsMap.set(threadId, {
        thread_id: row.thread_id,
        title: row.title,
        content: row.content,
        created_at: row.created_at,
        user_id: row.user_id,
        categories: [],
      });
    }

    if (row.category_name) {
      threadsMap.get(threadId).categories.push(row.category_name);
    }
  });

  return Array.from(threadsMap.values());
}
