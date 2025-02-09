"use client";

import { Separator } from "@/components/ui/separator";

interface SidebarThreadsProps {
  num: number;
  title: String;
  author: String;
  createdAt: String;
}

export default function SidebarThreads({
  num,
  title,
  author,
  createdAt,
}: SidebarThreadsProps) {
  return (
    <div className="text-primary-foreground p-2 border-0 border-b-[1px] border-background">
      <div className="text-base">
        <div className="flex items-center gap-3">
          <div className="text-chart-1 font-bold">#{num}</div>
          <div className="text-popover">{title}</div>
        </div>
        <div className="text-sm text-primary-foreground/70 ml-8 mb-1">
          by {author} ({createdAt})
        </div>
      </div>
    </div>
  );
}
