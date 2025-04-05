"use client";

import { useState, useEffect } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { useRouter } from "next/navigation";
import { Toast } from "./ui/toast";
import { useToast } from "@/hooks/use-toast";

interface UpvoteButtonProps {
  type: "thread" | "subthread"; // To distinguish between threads and subthreads
  id: number; // thread_id or subthread_id
  initialUpvoteCount: number; // Initial upvote count
  userId?: number; // Current user's ID (optional if not logged in)
}

export default function UpvoteButton({
  type,
  id,
  initialUpvoteCount,
  userId,
}: UpvoteButtonProps) {
  const router = useRouter();
  const [upvoteCount, setUpvoteCount] = useState(initialUpvoteCount);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const { toast } = useToast();
  // Check if the user has already upvoted
  useEffect(() => {
    if (!userId) {
      console.log("No user ID provided - skipping has-upvoted check");
      return;
    }

    const endpoint =
      type === "thread"
        ? `/api/threads/${id}/has-upvoted`
        : `/api/subthreads/${id}/has-upvoted`;

    fetch(`${endpoint}?userId=${userId}`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(`Has upvoted (${type}):`, data);
        setHasUpvoted(data.hasUpvoted);
      })
      .catch((error) => {
        console.error(`Error checking upvote status for ${type}:`, error);
      });
  }, [userId, id, type]);

  // Handle upvote action
  const handleUpvote = async () => {
    if (!userId) {
      router.push("/auth/login");
      return;
    }

    const endpoint =
      type === "thread"
        ? `/api/threads/${id}/upvote`
        : `/api/subthreads/${id}/upvote`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setUpvoteCount(data.upvoteCount);
        setHasUpvoted(true);
      } else {
        toast(data.error || `Failed to upvote ${type}`);
      }
    } catch (error) {
      console.error(`Error upvoting ${type}:`, error);
      toast({
        title: "Error",
        description: "An error occurred while upvoting.",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 justify-center">
      <span>{upvoteCount}</span>
      <button
        onClick={handleUpvote}
        disabled={hasUpvoted}
        className={`px-4 py-2 rounded ${
          hasUpvoted
            ? "text-gray-400 hover:cursor-not-allowed"
            : "text-white hover:border-[1px]"
        }`}
      >
        <IoIosArrowUp />
      </button>
    </div>
  );
}
