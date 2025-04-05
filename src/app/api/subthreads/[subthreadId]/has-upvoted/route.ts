import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { subthreadUpvotesTable, SelectSubthreadUpvote } from "@/schema";
import { eq, and } from "drizzle-orm";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

export async function GET(
  request: Request,
  context: { params: Promise<{ subthreadId: string }> }
) {
  const { subthreadId } = await context.params;

  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingUpvote: SelectSubthreadUpvote[] = await db
      .select()
      .from(subthreadUpvotesTable)
      .where(
        and(
          eq(subthreadUpvotesTable.subthread_id, parseInt(subthreadId)),
          eq(subthreadUpvotesTable.user_id, parseInt(userId))
        )
      );

    return NextResponse.json({ hasUpvoted: existingUpvote.length > 0 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to check upvote status" }, { status: 500 });
  }
}