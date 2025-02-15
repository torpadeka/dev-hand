import { getThreadDetail } from "@/actions/thread-queries";
import ThreadDetailClient from "./ThreadDetailClient";
import { selectAllCategoryName } from "@/actions/category-queries";
import { auth } from "@/auth";
import { getUserByEmail } from "@/actions/user-queries";

export default async function ThreadPage(props: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await props.params;

  const [session, threadData, categories] = await Promise.all([
    auth(), // Get user session
    getThreadDetail(Number.parseInt(threadId)).then((data) => ({
      ...data,
      categories: data.categories.map((name) => ({ id: null, name })),
    })),
    selectAllCategoryName(),
  ]);

  let user = null;
  if (session?.user?.email) {
    user = await getUserByEmail(session.user.email);
  }

  return (
    <div className="">
      <ThreadDetailClient
        thread={threadData}
        availableCategories={categories}
        user={user}
      />
    </div>
  );
}
