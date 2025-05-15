import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { expertApplicationsTable } from "@/schema";
import { eq } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export async function PATCH(request: Request, { params }: { params: { applicationId: string } }) {
  const applicationId = parseInt(params.applicationId);
  const body = await request.json();
  const { status } = body;

  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    await db
      .update(expertApplicationsTable)
      .set({ status })
      .where(eq(expertApplicationsTable.application_id, applicationId));

    return NextResponse.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Failed to update status:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
