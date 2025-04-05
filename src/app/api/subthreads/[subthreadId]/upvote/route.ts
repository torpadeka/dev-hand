import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { subthreadUpvotesTable, InsertSubthreadUpvote } from "@/schema";
import { eq, and, sql } from "drizzle-orm";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

export async function POST(
  request: Request,
  context: { params: Promise<{ subthreadId: string }> }
) {
  const { subthreadId } = await context.params;

  const body = await request.json();
  const userId = body.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingUpvote = await db
      .select()
      .from(subthreadUpvotesTable)
      .where(
        and(
          eq(subthreadUpvotesTable.subthread_id, parseInt(subthreadId)),
          eq(subthreadUpvotesTable.user_id, parseInt(userId))
        )
      );

    if (existingUpvote.length > 0) {
      return NextResponse.json({ error: "You have already upvoted this subthread" }, { status: 400 });
    }

    const newUpvote: InsertSubthreadUpvote = {
      subthread_id: parseInt(subthreadId),
      user_id: parseInt(userId),
    };
    await db.insert(subthreadUpvotesTable).values(newUpvote);

    const upvoteCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(subthreadUpvotesTable)
      .where(eq(subthreadUpvotesTable.subthread_id, parseInt(subthreadId)));

    return NextResponse.json({ message: "Upvoted successfully", upvoteCount: upvoteCount[0].count });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to upvote subthread" }, { status: 500 });
  }
}