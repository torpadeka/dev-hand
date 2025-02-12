"use client";

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
  const createdAtDate = new Date(createdAt);
  const now = new Date();
  const diff = new DateDiff(now, createdAtDate);

  let timeAgo;
  if (diff.years() >= 1) {
    timeAgo = `${Math.floor(diff.years())} years ago`;
  } else if (diff.months() >= 1) {
    timeAgo = `${Math.floor(diff.months())} months ago`;
  } else if (diff.days() >= 1) {
    timeAgo = `${Math.floor(diff.days())} days ago`;
  } else if (diff.hours() >= 1) {
    timeAgo = `${Math.floor(diff.hours())} hours ago`;
  } else if (diff.minutes() >= 1) {
    timeAgo = `${Math.floor(diff.minutes())} minutes ago`;
  } else {
    timeAgo = "Just now";
  }
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
