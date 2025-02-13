"use client";
import { useState } from "react";

interface Thread {
  thread_id: number | null;
  title: string;
  content: string;
  thread_type: string;
  created_at: string;
  updated_at?: string | null;
  user: {
    id: number | null;
    username: string;
  };
  categories: { id: number | null; name: string | null }[];
  subthreads: Subthread[];
}

interface Subthread {
  subthread_id: number;
  user: {
    id: number;
    username: string | null;
  };
  title: string;
  content: string;
  is_ai_generated: boolean;
  created_at: string;
  updated_at?: string | null;
}

interface Reply {
  reply_id: number;
  user: {
    id: number;
    username: string;
  };
  content: string;
  created_at: string;
  updated_at?: string | null;
}

export default function ThreadDetailClient({ thread }: { thread: Thread }) {
  const [replies, setReplies] = useState<Record<number, Reply[]>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<number, boolean>>(
    {}
  );

  // ✅ Fetch replies only when user clicks "See Replies"
  const fetchReplies = async (subthreadId: number) => {
    if (replies[subthreadId]) return; // ✅ Prevent re-fetching if already loaded

    setLoadingReplies((prev) => ({ ...prev, [subthreadId]: true })); // ✅ Set loading state

    try {
      const res = await fetch(`/api/replies?subthreadId=${subthreadId}`);
      const data = await res.json();
      setReplies((prev) => ({ ...prev, [subthreadId]: data }));
    } catch (error) {
      console.error("Failed to load replies:", error);
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [subthreadId]: false })); // ✅ Remove loading state
    }
  };
  console.log(thread.content);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{thread.title}</h1>
      <p className="text-gray-500">
        By {thread.user.username} |{" "}
        {/* {new Date(thread.created_at).toLocaleString()} */}
      </p>
      <div
        className="mt-1"
        dangerouslySetInnerHTML={{ __html: thread.content }} // ✅ Must be an object
      ></div>
      <h2 className="mt-4 text-xl font-semibold">Subthreads</h2>
      {thread.subthreads.map((subthread) => (
        <div key={subthread.subthread_id} className="p-3 mt-2 border rounded">
          <p className="font-semibold">{subthread.title}</p>
          <p className="text-sm text-gray-500">By {subthread.user.username}</p>
          <div
            className="mt-1"
            dangerouslySetInnerHTML={{ __html: subthread.content }} // ✅ Must be an object
          ></div>

          <button
            className="mt-2 text-blue-500 underline"
            onClick={() => fetchReplies(subthread.subthread_id)}
            disabled={loadingReplies[subthread.subthread_id]}
          >
            {loadingReplies[subthread.subthread_id]
              ? "Loading..."
              : "See Replies"}
          </button>

          {/* ✅ Show Replies only after they are loaded */}
          {replies[subthread.subthread_id] && (
            <div className="mt-2 pl-4 border-l-2 border-gray-400">
              {replies[subthread.subthread_id].length > 0 ? (
                replies[subthread.subthread_id].map((reply) => (
                  <div key={reply.reply_id} className="mt-1">
                    <p className="text-sm text-gray-700">
                      <strong>{reply.user.username}</strong>:{" "}
                      <div
                        className="mt-1"
                        dangerouslySetInnerHTML={{ __html: reply.content }} // ✅ Must be an object
                      ></div>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No replies yet.</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
