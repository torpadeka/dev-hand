"use client";

import React, { useRef, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import CategoryTag from "./CategoryTag";
import DateDiff from "date-diff";
import { Separator } from "./ui/separator";
import { getTimeAgo } from "@/app/utils/timeAgo";
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// const thread = {
//   title:
//     "How to create a design system and what is the purpose of design system?",
//   category: ["Completed", "Dynamic Programming", "Graph Theory"],
//   author: "Farrel",
//   votes: 7,
//   comments: 1,
//   createdAt: "2 days ago",
// };

// const SubThread = {
//   title: "Purpose of design system",
//   content:
//     "A design system is a set of standards, components, and guidelines " +
//     "that ensure consistency, efficiency, and scalability across a project " +
//     "or organization. It streamlines collaboration between teams, maintains " +
//     "a cohesive look and feel, and enhances product quality, all while ensuring " +
//     "brand alignment and making it easier to update and scale products.",
//   votes: 3,
//   user: "Farrel",
//   createdAt: "1 day ago",
// };

interface SubThreadProps {
  thread: Thread;
  availableCategories: Map<number, string>;
}

export default function SubThreadCard({
  thread,
  availableCategories,
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
          <p className="font-bold text-primary-foreground">{thread.up_vote}</p>
          <div
            className="hover:cursor-pointer hover:text-popover"
            onClick={upVote}
          >
            <IoIosArrowUp />
          </div>
        </div>
        <p className="ml-4 text-2xl text-primary-foreground">{thread.title}</p>
      </div>
      <div
        className="ml-12 my-4 "
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
