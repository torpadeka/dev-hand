import { IoIosArrowUp } from "react-icons/io";
import { IoEllipsisVertical } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import { getTimeAgo } from "@/app/utils/timeAgo";

interface AnswerCardProps {
  subThread: Subthread;
}

export default function AnswerCard({ subThread }: AnswerCardProps) {
  const [userVote, setUserVote] = useState(subThread.up_vote);
  const AddVotes = () => {
    setUserVote(userVote + 1);
  };
  let timeAgo = getTimeAgo(subThread.created_at);
  return (
    <div className="flex flex-col justify-center items-center mt-5 ml-10 bg-primary rounded-xl text-primary-foreground">
      <div className="border-gray-500 border rounded-xl w-full pl-2">
        <div className="flex items-center mt-3 ml-3">
          <Avatar className="border-2 border-gray-700 rounded-xl w-12 h-12">
            <AvatarImage></AvatarImage>
            <AvatarFallback>SL</AvatarFallback>
          </Avatar>
          <div className="text-sm flex flex-col ml-3">
            <p>{subThread.user.username}</p>
            <p>{timeAgo}</p>
          </div>
        </div>
        <div
          className="flex items-start m-3 mt-1 flex-col"
          dangerouslySetInnerHTML={{ __html: subThread.content }}
        ></div>
        <div className="flex justify-between">
          <div className="ml-3 mb-3 flex gap-5 items-center ">
            <div
              className="hover:cursor-pointer hover:text-popover flex items-center "
              onClick={AddVotes}
            >
              <IoIosArrowUp />
            </div>
            <div className="hover:cursor-pointer hover:text-popover flex items-center">
              <IoEllipsisVertical />
            </div>
          </div>
          <div>
            <p className="mr-5">{subThread.up_vote} upvotes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
