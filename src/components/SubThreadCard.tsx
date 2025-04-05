"use client";

import React, { useRef, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import CategoryTag from "./CategoryTag";
import DateDiff from "date-diff";
import { Separator } from "./ui/separator";
import { getTimeAgo } from "@/app/utils/timeAgo";
import UpvoteButton from "./UpVote";

interface SubThreadProps {
  thread: Thread;
  availableCategories: Map<number, string>;
  user: any;
}

export default function SubThreadCard({
  thread,
  availableCategories,
  user,
}: SubThreadProps) {
  const [vote, setVote] = useState(thread.up_vote);
  const [value, setValue] = useState("");
  const quillRef = useRef(null);

  const upVote = () => {
    setVote(vote + 1);
  };

  let timeAgo = getTimeAgo(thread.created_at);

  return (
    <div className="flex flex-col ml-10 mt-5 bg-primary rounded-xl pl-5">
      <div className="flex mt-4">
        <div className="flex items-center gap-2">
          <UpvoteButton
            type="thread"
            id={thread.thread_id || 0}
            initialUpvoteCount={thread.up_vote}
            userId={user.user_id}
          />
        </div>
        <p className="ml-4 text-2xl text-primary-foreground">{thread.title}</p>
      </div>
      <div
        className="ml-12 my-4 p-4"
        dangerouslySetInnerHTML={{ __html: thread.content }}
      ></div>
      <div className="flex justify-between items-center mt-1 mb-4 w-full">
        <div className="flex gap-7 ml-10">
          {thread.categories.map((category, index) => (
            <CategoryTag
              key={index}
              category={category.name?.toString() || ""}
              availableCategories={availableCategories}
            />
          ))}
        </div>
        <div className="">
          <p className="mr-5">Asked {timeAgo}</p>
          <p className="mr-5 text-sm text-right">by {thread.user.username}</p>
        </div>
      </div>
    </div>
  );
}
