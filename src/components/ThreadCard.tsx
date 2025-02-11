"use client";

import { useState } from "react";
import CategoryTag from "./CategoryTag";
import { IoIosArrowUp, IoIosText } from "react-icons/io";

interface ThreadCardProps {
  title: string;
  category: string[];
  votes: number;
  comments: number;
  createdAt: string;
}

export default function ThreadCard({
  title,
  category,
  votes,
  comments,
  createdAt,
}: ThreadCardProps) {
  const addUpvote = () => {
    setVoteCount(voteCount + 1);
  };

  const [voteCount, setVoteCount] = useState(votes);
  return (
    <>
      <div className="px-4 bg-primary rounded-xl flex justify-between items-center shadow-md w-full">
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
            {category.map((category) => (
              <CategoryTag key={category} category={category} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 text-card-foreground/70 w-2/12 text-end mr-3">
          <div className="">
            <div className="flex items-center gap-2 w-full justify-end">
              <IoIosText /> {comments}
            </div>
          </div>
          <div className="">{createdAt}</div>
        </div>
      </div>
    </>
  );
}
