import {
  getAllThreadsWithCategories,
  getThreadDetail,
} from "@/actions/thread-queries";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const threadId = Number(searchParams.get("threadid")) || -1;
  const threadsDetail = await getThreadDetail(threadId);

  return NextResponse.json(threadsDetail);
}
