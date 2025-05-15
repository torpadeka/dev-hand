import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { expertApplicationsTable, usersTable } from "@/schema";
import { eq } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export async function GET() {
  try {
    const applications = await db
      .select({
        application_id: expertApplicationsTable.application_id,
        full_name: expertApplicationsTable.full_name,
        github_link: expertApplicationsTable.github_link,
        status: expertApplicationsTable.status,
        created_at: expertApplicationsTable.created_at,
        user_id: expertApplicationsTable.user_id,
        username: usersTable.username,
      })
      .from(expertApplicationsTable)
      .innerJoin(usersTable, eq(expertApplicationsTable.user_id, usersTable.user_id))
      .orderBy(expertApplicationsTable.created_at);

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Failed to fetch expert applications:", error);
    return NextResponse.json({ error: "Failed to load applications" }, { status: 500 });
  }
}
