import { getNewestThreads } from "@/actions/thread-queries";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 10; // ✅ Default to 10 newest threads

  try {
    const threadsData = await getNewestThreads(limit);
    return NextResponse.json(threadsData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch newest threads" }, { status: 500 });
  }
}
