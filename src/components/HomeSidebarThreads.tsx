import { IoIosBonfire, IoIosRefresh } from "react-icons/io";
import SidebarThreads from "./SidebarThreads";
import { useEffect, useState } from "react";

interface Thread {
  thread_id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: number;
  username: string;
  categories: string[];
  up_vote: number;
  sub_thread_count: number;
}

export default function HomeSidebarThreads() {
  const [loadingSideThread, setLoadingSideThread] = useState(true);
  const [newestThread, setNewestThread] = useState<Thread[]>([]);
  const [hotestThread, setHotestThread] = useState<Thread[]>([]);

  useEffect(() => {
    async function fetchThreads() {
      try {
        setLoadingSideThread(true);

        const res = await fetch(`/api/threads/fetchnewest?limit=5`);
        if (!res.ok) throw new Error("Failed to fetch threads");

        const data = await res.json();
        setNewestThread(data.threads);

        const res1 = await fetch(`/api/threads/fetchhotest?limit=5`);
        if (!res1.ok) throw new Error("Failed to fetch threads");

        const data1 = await res1.json();
        setHotestThread(data1.threads);
        console.log("hotest threads", data1.threads);
      } catch (error) {
        console.error("Error fetching newest threads:", error);
      } finally {
        setLoadingSideThread(false);
      }
    }
    fetchThreads();
  }, []);

  return (
    <div className="my-4 mx-3 flex flex-col gap-3">
      <div className="bg-primary rounded-[15px] p-3">
        <div className="flex gap-2 justify-center text-primary-foreground text-xl mb-2 items-center">
          <IoIosBonfire /> Hot Topic <IoIosBonfire />
        </div>
        <div className="h-[2px] w-full bg-background mt-3"></div>
        <div className="flex flex-col gap-1">
          {newestThread &&
            hotestThread.map((thread, index) => (
              <SidebarThreads
                key={index}
                num={index + 1}
                title={thread.title}
                createdAt={thread.created_at}
                author={thread?.username ?? "Unknown"}
                subthreadCount={thread.sub_thread_count}
                id={thread.thread_id}
              />
            ))}
        </div>
      </div>

      <div className="bg-primary rounded-[15px] p-3">
        <div className="flex gap-2 justify-center text-primary-foreground text-xl mb-2 items-center">
          <IoIosRefresh /> Newest Forum <IoIosRefresh />
        </div>
        <div className="h-[2px] w-full bg-background mt-3"></div>
        <div className="flex flex-col gap-1">
          {newestThread &&
            newestThread.map((thread, index) => (
              <SidebarThreads
                key={index}
                num={index + 1}
                title={thread.title}
                createdAt={thread.created_at}
                author={thread?.username ?? "Unknown"}
                subthreadCount={thread.sub_thread_count}
                id={thread.thread_id}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
