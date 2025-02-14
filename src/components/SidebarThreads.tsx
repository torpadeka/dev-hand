"use client";

import { getTimeAgo } from "@/app/utils/timeAgo";
import { Separator } from "@/components/ui/separator";
import DateDiff from "date-diff";

interface SidebarThreadsProps {
  num: number;
  title: string;
  author: string;
  createdAt: string;
}

export default function SidebarThreads({
  num,
  title,
  author,
  createdAt,
}: SidebarThreadsProps) {
  let timeAgo = getTimeAgo(createdAt);
  return (
    <div className="text-primary-foreground p-2 border-0 border-b-[1px] border-background">
      <div className="text-base">
        <div className="flex items-center gap-3">
          <div className="text-chart-1 font-bold">#{num}</div>
          <div className="text-popover">{title}</div>
        </div>
        <div className="text-sm text-primary-foreground/70 ml-8 mb-1">
          by {author} ({timeAgo})
        </div>
      </div>
    </div>
  );
}
