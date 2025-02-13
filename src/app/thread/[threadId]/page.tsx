import { getThreadDetail } from "@/actions/thread-queries";
import ThreadDetailClient from "./ThreadDetailClient";

export default async function ThreadPage({
  params,
}: {
  params: { threadId: string };
}) {
  const threadId = Number(params.threadId);
  const threadData = await getThreadDetail(threadId); // ✅ Fetch thread & subthreads

  return <ThreadDetailClient thread={threadData} />;
}
