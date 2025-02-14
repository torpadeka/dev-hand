"use client";

import Navbar from "@/components/Navbar";
import SubThreadCard from "@/components/SubThreadCard";
import AnswerCard from "@/components/AnswerCard";
import { useEffect, useRef, useState } from "react";
import { IoChatbubbleOutline } from "react-icons/io5";
import SidebarThreads from "@/components/SidebarThreads";
import { IoArrowUp, IoArrowDown } from "react-icons/io5";
import RichTextEditorComponent from "@/components/RichTextEditorComponent";
import { Button } from "@/components/ui/button";
import { SaveConfirmationDialog } from "@/components/SaveConfirmationDialog";
import { AnswerConfirmation } from "@/components/AnswerConfirmation";
import { EditorContent } from "@tiptap/react";
import { redirect } from "next/navigation";
import { createSubThread } from "@/actions/thread-queries";

interface ThreadProps {
  thread: Thread;
  availableCategories: Map<number, string>;
  user: User | null;
}

export default function ThreadDetailClient({
  thread,
  availableCategories,
  user,
}: ThreadProps) {
  if (user == null) {
    redirect("/auth/login");
  }
  const [savedContent, setSavedContent] = useState("");
  const [error, setError] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [validate, setValidate] = useState(false);
  const editorRef = useRef<{ getEditorContent: () => void } | null>(null);
  const [sortBy, setSortBy] = useState("Oldest");
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const toggleSortBy = () => {
    setSortBy((prev) => (prev === "Oldest" ? "Newest" : "Oldest"));
  };

  useEffect(() => {
    if (!validate) return;
    if (savedContent.length < 50)
      setErrorMessage("Answer must at least 50 characters!");
    else setErrorMessage("");
    setValidate(false);
  }, [validate, savedContent]);

  const handleSave = () => {
    if (editorRef.current) {
      editorRef.current.getEditorContent();
    }
    setValidate(true);
  };
  const handleSubmit = async () => {
    if (!error) {
    }
    await createSubThread(
      thread.thread_id || 0,
      user.user_id,
      savedContent,
      false
    );
    console.log(savedContent);
    setIsConfirmationVisible(!isConfirmationVisible);
    setIsCommentVisible(!isCommentVisible);
    setError(true);
  };
  console.log(thread);
  return (
    <>
      <Navbar></Navbar>
      <div className="flex gap-10 rounded-md">
        <div className="w-full">
          <SubThreadCard
            thread={thread}
            availableCategories={availableCategories}
          />
          <div className="flex justify-between items-center flex-row mt-3">
            <div className="ml-24 flex gap-3 ">
              <p>Sort : </p>
              <p
                onClick={toggleSortBy}
                className="hover:cursor-pointer hover:text-popover flex items-center gap-3"
              >
                {sortBy} {sortBy === "Oldest" ? <IoArrowUp /> : <IoArrowDown />}
              </p>
            </div>
            <div
              className="hover:cursor-pointer hover:text-popover mr-7"
              onClick={() => setIsCommentVisible(!isCommentVisible)}
            >
              <IoChatbubbleOutline size={28} />
            </div>
          </div>
          {isCommentVisible && (
            <div className="mt-4 ml-20 bg-primary rounded-md ">
              <h1 className="pt-2 text-xl ml-5 text-primary-foreground">
                Your Answer
              </h1>
              <div className="ml-5 mr-5">
                <RichTextEditorComponent
                  ref={editorRef}
                  onSubmit={setSavedContent}
                />
                <p className="text-[0.8rem] font-medium text-destructive m-1">
                  {errorMessage}
                </p>
                <div className="flex items-center">
                  <Button
                    className="button bg-popover-foreground m-2"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    className="button bg-popover-foreground m-2"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="">
            {isConfirmationVisible && (
              <AnswerConfirmation
                onConfirm={() =>
                  setIsConfirmationVisible(!isConfirmationVisible)
                }
              />
            )}
            {thread.subthreads.length > 0 ? (
              thread.subthreads.map((subthread, index) => (
                <AnswerCard subThread={subthread} key={index}></AnswerCard>
              ))
            ) : (
              <p className="ml-24 mt-4 text-destructive text-center">
                No subthreads available
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
