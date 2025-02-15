import { getHotTopicThreads } from "@/actions/thread-queries";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 10; // ✅ Default to 10 hot threads

  try {
    const threadsData = await getHotTopicThreads(limit);
    return NextResponse.json(threadsData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hot topic threads" }, { status: 500 });
  }
}
