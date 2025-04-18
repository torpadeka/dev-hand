"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
import HomeSidebarThreads from "@/components/HomeSidebarThreads";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface HomeClientProps {
  categories: Map<number, string>;
  session?: any;
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
  session,
}: HomeClientProps) {
  const search = () => {
    console.log("Search");
  };
  console.log(session);

  const [threads, setThreads] = useState<Thread[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showMoreCategory, setShowMoreCategory] = useState(false);

  const [loadingThread, setLoadingThread] = useState(true);

  function getAllKeysFromValues(
    map: Map<number, string>,
    values: string[]
  ): number[][] {
    return values.map((value) =>
      [...map.entries()]
        .filter(([key, val]) => val === value)
        .map(([key]) => key)
    );
  }

  useEffect(() => {
    async function fetchThreads() {
      setLoadingThread(true);
      if (selectedCategories.length > 0) setCurrentPage(1);

      const selecterCategoryIds = getAllKeysFromValues(
        categories,
        selectedCategories
      );

      const categoryParams = selectedCategories.length
        ? `&categories=${selecterCategoryIds.join(",")}`
        : "";
      const res = await fetch(
        `/api/threads/fetchthread?page=${currentPage}&limit=3${categoryParams}`
      );
      const data = await res.json();
      console.log(data.total_count);
      setThreads(data.threads);
      setTotalCount(data.total_count);
      setTotalPages(data.total_pages);
      setLoadingThread(false);
    }
    fetchThreads();
  }, [currentPage, selectedCategories]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Input
                type="text"
                className="w-full pl-4 pr-12 py-3 bg-card border-border"
                placeholder="Type here to search..."
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={search}
              >
                <IoIosSearch className="h-5 w-5" />
              </Button>
            </div>

            {/* Category Selector */}
            <div className="flex items-center">
              <div className="flex-1 overflow-x-auto no-scrollbar">
                <HomeCategorySelector
                  onCategoryChange={setSelectedCategories}
                  showMore={showMoreCategory}
                  categories={categories}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMoreCategory(!showMoreCategory)}
                className="ml-2 flex items-center justify-center p-1"
              >
                <motion.div
                  animate={{ rotate: showMoreCategory ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <IoIosArrowDown className="h-5 w-5" />
                </motion.div>
              </Button>
            </div>

            {/* Threads */}
            {loadingThread ? (
              <div className="space-y-4">
                <Skeleton className="h-[120px] w-full rounded-lg" />
                <Skeleton className="h-[120px] w-full rounded-lg" />
                <Skeleton className="h-[120px] w-full rounded-lg" />
              </div>
            ) : (
              <div className="space-y-6">
                {threads.length > 0 ? (
                  threads.map((thread, index) => (
                    <ThreadCard
                      key={index}
                      {...thread}
                      availableCategories={categories}
                      curr_user_id={session?.user?.id}
                    />
                  ))
                ) : (
                  <Card className="p-8">
                    <p className="text-destructive text-center">
                      No threads found
                    </p>
                  </Card>
                )}

                {/* Pagination */}
                {threads.length > 0 && (
                  <div className="flex justify-center items-center gap-4 py-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      disabled={currentPage === 1}
                      className="h-9"
                    >
                      Previous
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={currentPage === totalPages}
                      className="h-9"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - 1/3 width on large screens */}
          <div className="lg:col-span-1">
            <HomeSidebarThreads />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <QuestionModal />
      </div>
    </div>
  );
}
