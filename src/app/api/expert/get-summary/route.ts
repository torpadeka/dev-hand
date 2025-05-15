import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { expertApplicationsTable } from "@/schema";
import { sql } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export async function GET() {
  try {
    const counts = await db
      .select({
        total: sql<number>`COUNT(*)`.mapWith(Number),
        pending: sql<number>`COUNT(*) FILTER (WHERE status = 'pending')`.mapWith(Number),
        approved: sql<number>`COUNT(*) FILTER (WHERE status = 'Approved')`.mapWith(Number),
        rejected: sql<number>`COUNT(*) FILTER (WHERE status = 'Rejected')`.mapWith(Number),
      })
      .from(expertApplicationsTable);

    const result = counts[0];

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching expert applications counts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
