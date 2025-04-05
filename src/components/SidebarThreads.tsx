"use client";

import { getTimeAgo } from "@/app/utils/timeAgo";
import { Separator } from "@/components/ui/separator";
import DateDiff from "date-diff";
import { useRouter } from "next/navigation";

interface SidebarThreadsProps {
  id: number;
  num: number;
  title: string;
  author: string;
  createdAt: string;
  subthreadCount: number;
}

export default function SidebarThreads({
  id,
  num,
  title,
  author,
  createdAt,
  subthreadCount,
}: SidebarThreadsProps) {
  let timeAgo = getTimeAgo(createdAt);
  const router = useRouter();
  return (
    <div
      className="text-primary-foreground p-2 border-0 border-b-[1px] border-background hover:bg-background/50 hover:cursor-pointer transition-all duration-200 ease-in-out"
      onClick={() => {
        router.push("/thread/" + id);
      }}
    >
      <div className="text-base">
        <div className="flex items-center gap-3">
          <div className="text-chart-1 font-bold">#{num}</div>
          <div className="text-popover">{title}</div>
        </div>
        <div className="flex gap-1 justify-between mr-4">
          <div className="text-sm text-primary-foreground/70 ml-8 mb-1">
            by {author} ({timeAgo})
          </div>
          <div className="text-sm text-primary-foreground/70">
            {subthreadCount} replies
          </div>
        </div>
      </div>
    </div>
  );
}
