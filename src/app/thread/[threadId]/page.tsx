import { getThreadDetail } from "@/actions/thread-queries";
import ThreadDetailClient from "./ThreadDetailClient";
import { selectAllCategoryName } from "@/actions/category-queries";

export default async function ThreadPage(props: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await props.params;

  const threadData = await getThreadDetail(Number.parseInt(threadId)); // ✅ Fetch thread & subthreads
  const categories = await selectAllCategoryName(); // ✅ Fetch thread & subthreads

  return (
    <div className="">
      <ThreadDetailClient
        thread={threadData}
        availableCategories={categories}
      />
    </div>
  );
  {
    /* <div className="flex mt-5 mr-5 w-[36rem] bg-primary rounded-xl text-primary-foreground flex-col items-center pl-5 pr-5">
          <h1 className="text-2xl mt-3">Similar Topic</h1>
          <div className="h-[2px] w-full bg-background mt-3"></div>
          <div className="flex flex-col gap-1">
            {threads.map((thread, index) => (
              <div className="" key={index}>
                <SidebarThreads
                  num={index + 1}
                  title={thread.title}
                  createdAt={thread.createdAt}
                  author={thread.author}
                />
              </div>
            ))}
          </div>
        </div> */
  }
}
