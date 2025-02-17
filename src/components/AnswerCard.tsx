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
  const editorRef = useRef<{ getEditorContent: () => void } | null>(null);
  const [clear, setClear] = useState(true);
  const [validate, setValidate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(true);
  const router = useRouter();
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const handleSave = () => {
    if (editorRef.current) {
      editorRef.current.getEditorContent();
    }
    setValidate(true);
  };

  useEffect(() => {
    if (!validate) return;
    if (savedContent.length < 25) {
      setErrorMessage("Reply must at least 25 characters!");
      setError(true);
    } else {
      setErrorMessage("");
      setError(false);
    }
    setValidate(false);
  }, [validate]);

  const handleSubmit = async () => {
    setIsConfirmationVisible(true);
    console.log(isConfirmationVisible);
    if (!error) {
      await createReply(
        subThread.subthread_id || 0,
        user.user_id,
        savedContent
      );
      console.log("show confirm");
      setClear(true);
      setSavedContent("");
      router.refresh();
      setError(true);
      setShowTextEditor(false);
      console.log(isConfirmationVisible);
    }
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
            <div
              className="hover:cursor-pointer hover:text-popover flex items-center gap-3"
              onClick={AddVotes}
            >
              <IoIosArrowUp />
              <p className="mr-5">{subThread.up_vote} upvotes</p>
            </div>
          </div>
        </div>
        {showTextEditor ? (
          <div className="w-full p-2">
            <RichTextEditorComponent
              ref={editorRef}
              onSubmit={setSavedContent}
              clear={clear}
            />
            <div className="text-destructive">{errorMessage}</div>
            <Button
              className="button bg-popover-foreground m-2"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              className={`button bg-popover-foreground m-2 ${
                error ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSubmit}
              disabled={error}
            >
              Submit
            </Button>
          </div>
        ) : (
          <div className=""></div>
        )}
        <div className="w-full">
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
