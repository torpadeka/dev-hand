"use server";

import { db } from "@/db";
import { InsertThread, threadsTable } from "@/schema";
import { and, eq } from "drizzle-orm";


export async function insertThread(
  user_id: number,
  title: string,
  content: string,
  thread_type: string,
  up_vote: number
): Promise<void> {
  await db.insert(threadsTable).values({
    user_id:user_id,
    title:title,
    content:content,
    thread_type:thread_type,
    up_vote:up_vote
  });
}
