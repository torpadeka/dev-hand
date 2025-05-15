import { IoIosArrowUp } from "react-icons/io";
import { IoEllipsisVertical } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useRef, useState } from "react";
import { getTimeAgo } from "@/app/utils/timeAgo";
import RichTextEditorComponent from "./RichTextEditorComponent";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createReply } from "@/actions/thread-queries";
import ReplyCard from "./ReplyCard";
import { motion } from "framer-motion";
import { AnswerConfirmation } from "./AnswerConfirmation";
import { IoDiamondSharp } from "react-icons/io5";
import ProfilePicture from "./ProfilePicture";
import UpvoteButton from "./UpVote";

interface AnswerCardProps {
  subThread: Subthread;
  user: User;
}

export default function AnswerCard({ subThread, user }: AnswerCardProps) {
  const [userVote, setUserVote] = useState(subThread.up_vote);
  const [showReplies, setShowReplies] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(true);
  const [savedContent, setSavedContent] = useState("");
  const [clear, setClear] = useState(true);
  const [validate, setValidate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const isExpert = subThread.user.is_expert;

  const handleSubmit = async () => {
    if (savedContent.length < 25) {
      setErrorMessage("Reply must at least 25 characters!");
      return;
    } else {
      setErrorMessage("");
    }
    setIsConfirmationVisible(true);
    console.log(isConfirmationVisible);
    await createReply(subThread.subthread_id || 0, user.user_id, savedContent);
    console.log("show confirm");
    setClear(true);
    setSavedContent("");
    router.refresh();
    setShowTextEditor(false);
    console.log(isConfirmationVisible);
  };

  const handleToggleEditor = () => {
    setShowTextEditor(!showTextEditor);
  };
  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
  };

  useEffect(() => {
    async function fetchReplies() {
      try {
        setLoadingReplies(true);

        const res = await fetch(
          "/api/threads/fetchreplies?subthreadid=" + subThread.subthread_id
        );
        if (!res.ok) throw new Error("Failed to fetch replies");

        const data = await res.json();
        setReplies(data.result);
        console.log("Replies: ", data.result);
      } catch (error) {
        console.error("Error fetching newest threads:", error);
      } finally {
        setLoadingReplies(false);
      }
    }
    fetchReplies();
  }, []);

  const AddVotes = () => {
    setUserVote(userVote + 1);
  };
  let timeAgo = getTimeAgo(subThread.created_at);
  return (
    <div className="flex flex-col justify-center items-center my-5 ml-10 bg-primary rounded-xl text-primary-foreground">
      <div className="border-gray-500 border rounded-xl w-full pl-2">
        <div className="flex items-center mt-3 ml-3">
          <ProfilePicture
            id={subThread.user.id}
            link={subThread.user.profile_picture}
            username={subThread.user.username}
            size={10}
          />
          <div className="text-sm flex flex-col ml-3">
            <p className="font-bold text-base flex items-center gap-2">
              {subThread.user.username}
              {isExpert ? <IoDiamondSharp /> : ""}
            </p>
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
              className="hover:cursor-pointer hover:text-popover flex items-center gap-2"
              onClick={handleToggleEditor}
            >
              Reply{" "}
              <motion.div
                animate={{ rotate: showTextEditor ? 0 : 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <IoIosArrowUp className="w-4 h-4 text-primary-foreground" />
              </motion.div>
            </div>
            <div
              className="hover:cursor-pointer hover:text-popover flex items-center select-none gap-3"
              onClick={handleToggleReplies}
            >
              {showReplies ? "Hide Replies" : "Show Replies"}
              <motion.div
                animate={{ rotate: showReplies ? 0 : 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <IoIosArrowUp className="w-4 h-4 text-primary-foreground" />
              </motion.div>
            </div>
          </div>
          <div>
            <UpvoteButton
              type="subthread"
              id={subThread.subthread_id || 0}
              initialUpvoteCount={subThread.up_vote}
              userId={user.user_id}
            />
          </div>
        </div>
        {showTextEditor ? (
          <div className="w-full p-2 flex flex-col ml-2">
            <div className="flex">
              <input
                name=""
                id=""
                onChange={(e) => setSavedContent(e.target.value)}
                value={savedContent}
                className="bg-primary border-[1px] p-1 rounded-xl w-4/5"
              />
              <Button
                className={`button bg-popover-foreground mx-2`}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
            <div className="text-destructive">{errorMessage}</div>
          </div>
        ) : (
          <div className=""></div>
        )}
        <div className="w-full mb-4">
          {showReplies ? (
            replies ? (
              replies.map((reply, index) => (
                <div className="w-full" key={index}>
                  <ReplyCard reply={reply} />
                </div>
              ))
            ) : (
              <div className="">No Replies</div>
            )
          ) : (
            <div className=""></div>
          )}
        </div>
      </div>
      {isConfirmationVisible && (
        <div className="absolute w-full">
          <AnswerConfirmation
            onConfirm={() => setIsConfirmationVisible(!isConfirmationVisible)}
          />
        </div>
      )}
    </div>
  );
}
