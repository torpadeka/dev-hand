"use client";
import { useEffect, useState } from "react";
import {
  IoIosBonfire,
  IoIosRefresh,
  IoIosSearch,
  IoIosArrowDown,
} from "react-icons/io";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import ThreadCard from "@/components/ThreadCard";
import SidebarThreads from "@/components/SidebarThreads";
import HomeCategorySelector from "@/components/HomeCategorySelector";
import QuestionModal from "@/components/QuestionModal";

interface HomeClientProps {
  categories: Map<number, string>;
  // threads: {
  //   thread_id: number;
  //   title: string;
  //   content: string;
  //   created_at: string;
  //   user_id: string;
  //   categories: string[];
  //   up_vote: number;
  //   sub_thread_count: number;
  //   username: string;
  // }[];
}

interface Thread {
  thread_id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: number;
  username: string;
  up_vote: number;
  sub_thread_count: number;
  categories: string[];
}

export default function HomeClient({
  categories /*, threads*/,
}: HomeClientProps) {
  const search = () => {
    console.log("Search");
  };

  const [threads, setThreads] = useState<Thread[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showMoreCategory, setShowMoreCategory] = useState(false);

  function getAllKeysFromValues(
    map: Map<number, string>,
    values: string[]
  ): number[][] {
    return values.map(
      (value) =>
        [...map.entries()]
          .filter(([key, val]) => val === value)
          .map(([key]) => key) // ✅ Extract all matching keys
    );
  }

  useEffect(() => {
    async function fetchThreads() {
      if (selectedCategories.length > 0) setCurrentPage(1);

      const selecterCategoryIds = getAllKeysFromValues(
        categories,
        selectedCategories
      );

      const categoryParams = selectedCategories.length
        ? `&categories=${selecterCategoryIds.join(",")}`
        : "";
      const res = await fetch(
        `/api/threads?page=${currentPage}&limit=3${categoryParams}`
      );
      const data = await res.json();
      console.log(data.total_count);
      setThreads(data.threads);
      setTotalCount(data.total_count);
      setTotalPages(data.total_pages);
    }
    fetchThreads();
  }, [currentPage, selectedCategories]);

  // const filteredThread = threads.filter(
  //   (thread) =>
  //     selectedCategories.length === 0 ||
  //     thread.categories.some((category) =>
  //       selectedCategories.includes(category)
  //     )
  // );

  return (
    <div className="w-screen h-screen bg-background">
      <Navbar />

      <div className="flex gap-2">
        {/* Left Content */}
        <div className="flex flex-col w-2/3 ml-10 mt-5 min-w-0">
          {/* Search Bar */}
          <div className="flex bg-primary items-center rounded-xl">
            <input
              type="text"
              className="w-full p-2 pl-3 bg-primary rounded-xl focus:outline-none"
              placeholder="Type here to search..."
            />
            <IoIosSearch
              size={30}
              className="mr-2 cursor-pointer"
              onClick={search}
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center my-3 text-primary-foreground">
            <div className="no-scrollbar items-center overflow-auto mr-2">
              <HomeCategorySelector
                onCategoryChange={setSelectedCategories}
                showMore={showMoreCategory}
                categories={categories} // ✅ Pass fetched categories
              />
            </div>
            <button
              onClick={() => setShowMoreCategory(!showMoreCategory)}
              className="flex items-center text-lg font-semibold"
            >
              <motion.div
                animate={{ rotate: showMoreCategory ? 180 : 0 }} // ✅ Animate dropdown arrow
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <IoIosArrowDown className="w-6 h-6" />
              </motion.div>
            </button>
          </div>

          {/* Threads */}
          <div className="mt-4 space-y-4">
            {threads.length > 0 ? (
              threads.map((thread, index) => (
                <ThreadCard
                  key={index}
                  {...thread}
                  availableCategories={categories}
                />
              ))
            ) : (
              <p className="text-destructive text-center text-base">
                No thread found
              </p>
            )}
          </div>
          <div className="flex justify-center mt-4 gap-3">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-1/3 my-4 mx-3 flex flex-col gap-3">
          {/* Hot Topics */}
          <div className="bg-primary rounded-[15px] p-3">
            <div className="flex gap-2 justify-center text-primary-foreground text-xl mb-2 items-center">
              <IoIosBonfire /> Hot Topic <IoIosBonfire />
            </div>
            <div className="h-[2px] w-full bg-background mt-3"></div>
            <div className="flex flex-col gap-1">
              {threads.map((thread, index) => (
                <SidebarThreads
                  key={index}
                  num={index + 1}
                  title={thread.title}
                  createdAt={thread.created_at}
                  author={thread.username}
                />
              ))}
            </div>
          </div>

          {/* Newest Forum */}
          <div className="bg-primary rounded-[15px] p-3">
            <div className="flex gap-2 justify-center text-primary-foreground text-xl mb-2 items-center">
              <IoIosRefresh /> Newest Forum <IoIosRefresh />
            </div>
            <div className="h-[2px] w-full bg-background mt-3"></div>
            <div className="flex flex-col gap-1">
              {threads.map((thread, index) => (
                <SidebarThreads
                  key={index}
                  num={index + 1}
                  title={thread.title}
                  createdAt={thread.created_at}
                  author={thread.username}
                />
              ))}
            </div>
            {/* Pagination Controls */}
          </div>
        </div>
      </div>

      {/* Floating Question Button */}
      <div className="fixed bottom-4 right-4">
        <QuestionModal />
      </div>
    </div>
  );
}
