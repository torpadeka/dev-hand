"use server";

import { db } from "@/db";
import { InsertThread, threadsTable } from "@/schema";
import { and, eq } from "drizzle-orm";

export async function insertThread(
  user_id: string,
  title: string,
  content: string,
  thread_type: string
): Promise<void> {
  await db.insert(threadsTable).values({
    thread_id: '1',
    user_id,
    title,
    content,
    thread_type,
  });
}
