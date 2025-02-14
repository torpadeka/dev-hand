"use client";

import { useState } from "react";
import CategoryTag from "./CategoryTag";
import { IoIosArrowUp, IoIosText } from "react-icons/io";
import DateDiff from "date-diff";
import { redirect } from "next/navigation";
import { getTimeAgo } from "@/app/utils/timeAgo";

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
}: ThreadCardProps) {
  const addUpvote = () => {
    setVoteCount(voteCount + 1);
  };

  const [voteCount, setVoteCount] = useState(up_vote);

  let timeAgo = getTimeAgo(created_at);

  const openDetailPage = () => {
    redirect("/thread/" + thread_id);
  };

  return (
    <>
      <div
        className="px-4 bg-primary rounded-xl flex justify-between items-center shadow-md w-full hover:cursor-pointer hover:shadow-primary"
        onClick={openDetailPage}
      >
        <div className="w-1/12 mr-3">
          <div className="flex items-center gap-2 justify-center">
            {voteCount}
            <div
              className="hover:text-popover hover:cursor-pointer"
              onClick={addUpvote}
            >
              <IoIosArrowUp />
            </div>
          </div>
        </div>
        <div className="w-9/12 flex flex-col pt-4 pb-2">
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
