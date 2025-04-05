"use client";

import { useEffect, useState } from "react";
import CategoryTag from "./CategoryTag";
import { IoIosArrowUp, IoIosText } from "react-icons/io";
import DateDiff from "date-diff";
import { redirect, useRouter } from "next/navigation";
import { getTimeAgo } from "@/app/utils/timeAgo";
import { auth } from "@/auth";

interface ThreadCardProps {
  thread_id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: number;
  categories: string[];
  up_vote: number;
  sub_thread_count: number;
  availableCategories: Map<number, string>;
  curr_user_id?: number;
}

export default function ThreadCard({
  thread_id,
  title,
  content,
  created_at,
  categories,
  up_vote,
  sub_thread_count,
  availableCategories,
  curr_user_id,
}: ThreadCardProps) {
  // const addUpvote = () => {
  //   setVoteCount(voteCount + 1);
  // };
  const router = useRouter();
  const [upvoteCount, setUpvoteCount] = useState(up_vote);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  useEffect(() => {
    if (curr_user_id) {
      console.log("curr_user_id", curr_user_id);
      fetch(`/api/threads/${thread_id}/has-upvoted?userId=${curr_user_id}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => setHasUpvoted(data.hasUpvoted));
    }
  }, [curr_user_id, thread_id]);

  const handleUpvote = async () => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (!curr_user_id) {
      alert("User ID not found. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`/api/threads/${thread_id}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: curr_user_id }),
      });

      const data = await res.json();
      if (res.ok) {
        setUpvoteCount(data.upvoteCount);
        setHasUpvoted(true);
      } else {
        alert(data.error || "Failed to upvote thread");
      }
    } catch (error) {
      console.error("Error upvoting thread:", error);
      alert("An error occurred while upvoting the thread");
    }
  };

  let timeAgo = getTimeAgo(created_at);

  const openDetailPage = () => {
    redirect("/thread/" + thread_id);
  };

  return (
    <>
      <div className="px-4 bg-primary rounded-xl flex justify-between items-center shadow-md w-full hover:cursor-pointer hover:shadow-primary">
        <div className="w-1/12 mr-3">
          <div className="flex items-center gap-2 justify-center">
            {upvoteCount}
            <button
              onClick={handleUpvote}
              disabled={hasUpvoted}
              className={`px-4 py-2 rounded ${
                hasUpvoted
                  ? "text-gray-400 hover:cursor-not-allowed"
                  : " text-white hover:border-[1px]"
              }`}
            >
              <IoIosArrowUp className="" />
            </button>
          </div>
        </div>
        <div
          className="w-9/12 flex flex-col pt-4 pb-2"
          onClick={openDetailPage}
        >
          <div className="">
            <h3 className="text-card-foreground text-lg">{title}</h3>
          </div>
          <div className="flex gap-3 mt-2">
            {categories.map((category, idx) => (
              <CategoryTag
                key={category}
                category={category}
                availableCategories={availableCategories}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 text-card-foreground/70 w-2/12 text-end mr-3">
          <div className="">
            <div className="flex items-center gap-2 w-full justify-end">
              <IoIosText /> {sub_thread_count}
            </div>
          </div>
          <div className="">{timeAgo}</div>
        </div>
      </div>
    </>
  );
}
