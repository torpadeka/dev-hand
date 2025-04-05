import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { threadUpvotesTable, SelectThreadUpvote } from "@/schema";
import { eq, and } from "drizzle-orm";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

export async function GET(
  request: Request,
  context: { params: Promise<{ threadId: string }> } // Update the type to reflect that params is a Promise
) {
  // Await the params to resolve the dynamic route parameters
  const { threadId } = await context.params;

  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  console.log("userId", userId);
  console.log("userId", threadId);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingUpvote: SelectThreadUpvote[] = await db
      .select()
      .from(threadUpvotesTable)
      .where(
        and(
          eq(threadUpvotesTable.thread_id, parseInt(threadId)),
          eq(threadUpvotesTable.user_id, parseInt(userId))
        )
      );
      console.log("existingUpvote", existingUpvote);
    return NextResponse.json({ hasUpvoted: existingUpvote.length > 0 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to check upvote status" }, { status: 500 });
  }
}