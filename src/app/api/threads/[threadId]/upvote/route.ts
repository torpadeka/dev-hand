import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { threadUpvotesTable, InsertThreadUpvote } from "@/schema";
import { eq, and, sql } from "drizzle-orm";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

export async function POST(
  request: Request,
  context: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await context.params;

  const body = await request.json();
  const userId = body.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingUpvote = await db
      .select()
      .from(threadUpvotesTable)
      .where(
        and(
          eq(threadUpvotesTable.thread_id, parseInt(threadId)),
          eq(threadUpvotesTable.user_id, parseInt(userId))
        )
      );

    if (existingUpvote.length > 0) {
      return NextResponse.json({ error: "You have already upvoted this thread" }, { status: 400 });
    }

    const newUpvote: InsertThreadUpvote = {
      thread_id: parseInt(threadId),
      user_id: parseInt(userId),
    };
    await db.insert(threadUpvotesTable).values(newUpvote);

    const upvoteCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(threadUpvotesTable)
      .where(eq(threadUpvotesTable.thread_id, parseInt(threadId)));

    return NextResponse.json({ message: "Upvoted successfully", upvoteCount: upvoteCount[0].count });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to upvote thread" }, { status: 500 });
  }
}