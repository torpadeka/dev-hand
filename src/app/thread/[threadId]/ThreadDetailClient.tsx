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
import { redirect, useRouter } from "next/navigation";
import { createSubThread } from "@/actions/thread-queries";
import HomeSidebarThreads from "@/components/HomeSidebarThreads";
import { IoIosBonfire } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton";
import RelatedResourcesWidget from "@/components/RelatedResources";

interface ThreadProps {
  thread: Thread;
  availableCategories: Map<number, string>;
  user: User | null;
}

interface HotThread {
  thread_id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: number;
  username: string;
  categories: string[];
  up_vote: number;
  sub_thread_count: number;
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
  const [loadingSideThread, setLoadingSideThread] = useState(true);
  const [clear, setClear] = useState(true);
  const [hotestThread, setHotestThread] = useState<HotThread[]>([]);
  const router = useRouter();

  const toggleSortBy = () => {
    setSortBy((prev) => (prev === "Oldest" ? "Newest" : "Oldest"));
  };

  useEffect(() => {
    if (!validate) return;
    if (savedContent.length < 50) {
      setErrorMessage("Answer must at least 50 characters!");
      setError(true);
    } else {
      setErrorMessage("");
      setError(false);
    }
    setValidate(false);
  }, [validate]);

  const handleSave = () => {
    if (editorRef.current) {
      editorRef.current.getEditorContent();
    }
    setValidate(true);
  };
  const handleSubmit = async () => {
    if (!error) {
      await createSubThread(
        thread.thread_id || 0,
        user.user_id,
        savedContent,
        false
      );
      console.log(savedContent);
      setClear(true);
      setIsCommentVisible(false);
      setSavedContent("");
      router.refresh();
      setError(true);
    }
  };

  useEffect(() => {
    async function fetchThreads() {
      try {
        setLoadingSideThread(true);

        const res1 = await fetch(`/api/threads/fetchhotest?limit=5`);
        if (!res1.ok) throw new Error("Failed to fetch threads");

        const data1 = await res1.json();
        setHotestThread(data1.threads);
        console.log("hotest threads", data1.threads);
      } catch (error) {
        console.error("Error fetching newest threads:", error);
      } finally {
        setLoadingSideThread(false);
      }
    }
    fetchThreads();
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <div className="flex gap-10 rounded-md">
        <div className="w-full flex flex-row gap-10">
          <div className="w-2/3">
            <SubThreadCard
              thread={thread}
              availableCategories={availableCategories}
              user={user}
            />
            <div className="flex justify-between items-center flex-row mt-3">
              <div className="ml-14 flex gap-3 ">
                <p>Sort : </p>
                <p
                  onClick={toggleSortBy}
                  className="hover:cursor-pointer hover:text-popover flex items-center gap-3"
                >
                  {sortBy}{" "}
                  {sortBy === "Oldest" ? <IoArrowUp /> : <IoArrowDown />}
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
              <div className="mt-4 ml-10 bg-primary rounded-md ">
                <h1 className="pt-2 text-xl ml-5 text-primary-foreground">
                  Your Answer
                </h1>
                <div className="ml-5 mr-5">
                  <RichTextEditorComponent
                    ref={editorRef}
                    onSubmit={setSavedContent}
                    clear={clear}
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
                      className={`button bg-popover-foreground m-2 ${
                        error ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={handleSubmit}
                      disabled={error}
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
                [...thread.subthreads]
                  .sort((a, b) => b.up_vote - a.up_vote)
                  .map((subthread, index) => (
                    <AnswerCard subThread={subthread} key={index} user={user} />
                  ))
              ) : (
                <p className="ml-24 mt-4 text-destructive text-center">
                  No subthreads available
                </p>
              )}
            </div>
          </div>
          <div className="w-1/3 ">
            <div className="bg-primary rounded-[15px] p-3 mt-5 mr-10 sticky top-5">
              <div className="flex gap-2 justify-center text-primary-foreground text-xl mb-2 items-center">
                <IoIosBonfire /> Hot Topic <IoIosBonfire />
              </div>
              <div className="h-[2px] w-full bg-background mt-3"></div>
              <div className="flex flex-col gap-1 w-full">
                {loadingSideThread ? (
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-[75px] w-full rounded-xl bg-background" />
                    <Skeleton className="h-[75px] w-full rounded-xl bg-background" />
                    <Skeleton className="h-[75px] w-full rounded-xl bg-background" />
                    <Skeleton className="h-[75px] w-full rounded-xl bg-background" />
                    <Skeleton className="h-[75px] w-full rounded-xl bg-background" />
                  </div>
                ) : (
                  hotestThread &&
                  hotestThread.map((thread, index) => (
                    <SidebarThreads
                      key={index}
                      num={index + 1}
                      title={thread.title}
                      createdAt={thread.created_at}
                      author={thread?.username ?? "Unknown"}
                      subthreadCount={thread.sub_thread_count}
                      id={thread.thread_id}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
