import {
  getAllThreadsWithCategories,
  getRepliesForSubthread,
  getThreadDetail,
} from "@/actions/thread-queries";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subthreadid = Number(searchParams.get("subthreadid")) || -1;
  const subThreadReplies = await getRepliesForSubthread(subthreadid)

  return NextResponse.json(subThreadReplies);
}
