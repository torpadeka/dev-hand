"use client";
import { Separator } from "@/components/ui/separator";

import CategoryFilterTag from "@/components/CategoryFilterTag";
import Navbar from "@/components/Navbar";
import SidebarThreads from "@/components/SidebarThreads";
import ThreadCard from "@/components/ThreadCard";
import { IoIosBonfire, IoIosRefresh, IoIosSearch } from "react-icons/io";
import QuestionModal from "@/components/QuestionModal";

const threads = [
  {
    title:
      "How to create a design system and what is the purpose of design system?",
    category: ["Completed", "Dynamic Programming", "Graph Theory"],
    author: "Farrel",
    votes: 7,
    comments: 1,
    createdAt: "2 days ago",
  },
  {
    title: "Best Practices in UI Design",
    category: ["Greedy", "Graph Theory", "Dynamic Programming"],
    author: "Farrel",
    votes: 3,
    comments: 5,
    createdAt: "2 days ago",
  },
  {
    title: "Best Practices in UI Design",
    category: ["Greedy", "Graph Theory", "Dynamic Programming"],
    author: "Farrel",
    votes: 3,
    comments: 5,
    createdAt: "Apr 14",
  },
  {
    title: "Best Practices in UI Design",
    category: ["Greedy", "Graph Theory", "Dynamic Programming"],
    author: "Farrel",
    votes: 3,
    comments: 5,
    createdAt: "Apr 14",
  },
  {
    title: "Best Practices in UI Design",
    category: ["Greedy", "Graph Theory", "Dynamic Programming"],
    author: "Farrel",
    votes: 3,
    comments: 5,
    createdAt: "Apr 14",
  },
  {
    title: "Best Practices in UI Design",
    category: ["Greedy", "Graph Theory", "Dynamic Programming"],
    author: "Farrel",
    votes: 3,
    comments: 5,
    createdAt: "Apr 14",
  },
  {
    title: "Best Practices in UI Design",
    category: ["Greedy", "Graph Theory", "Dynamic Programming"],
    author: "Farrel",
    votes: 3,
    comments: 5,
    createdAt: "Apr 14",
  },
  {
    title: "Best Practices in UI Design",
    category: ["Greedy", "Graph Theory", "Dynamic Programming"],
    author: "Farrel",
    votes: 3,
    comments: 5,
    createdAt: "Apr 14",
  },
  {
    title: "Best Practices in UI Design",
    category: ["Greedy", "Graph Theory", "Dynamic Programming"],
    author: "Farrel",
    votes: 3,
    comments: 5,
    createdAt: "Apr 14",
  },
  {
    title: "Best Practices in UI Design",
    category: ["Greedy", "Graph Theory", "Dynamic Programming"],
    author: "Farrel",
    votes: 3,
    comments: 5,
    createdAt: "Apr 14",
  },
  {
    title: "Best Practices in UI Design",
    category: ["Greedy", "Graph Theory", "Dynamic Programming"],
    author: "Farrel",
    votes: 3,
    comments: 5,
    createdAt: "Apr 14",
  },
  {
    title: "Best Practices in UI Design",
    category: ["Greedy", "Graph Theory", "Dynamic Programming"],
    author: "Farrel",
    votes: 3,
    comments: 5,
    createdAt: "Apr 14",
  },
];

export default function Home() {
  const search = () => {
    console.log("Search");
  };
  return (
    <div className="w-screen h-screen bg-background">
      <Navbar></Navbar>
      <div className="flex gap-2">
        <div className="flex flex-col w-2/3">
          <div className="ml-10 mt-5 flex bg-primary items-center rounded-xl">
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
          <div className="flex items-center ml-10 my-3 text-primary-foreground">
            <div className="mr-3">Category: </div>
            <div className="flex gap-3 no-scrollbar overflow-auto items-center rounded-xl">
              {threads.map((thread, index) => (
                <CategoryFilterTag key={index} category={thread.category[1]} />
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-4 ml-10">
            {threads.map((thread, index) => (
              <ThreadCard key={index} {...thread} />
            ))}
          </div>
        </div>
        <div className="w-1/3 my-4 mx-3 flex flex-col gap-3">
          <div className="bg-primary rounded-[15px] p-3">
            <div className="flex gap-2 justify-center text-primary-foreground text-xl mb-2 items-center">
              <IoIosBonfire /> Hot Topic <IoIosBonfire />
            </div>
            <div className="h-[2px] w-full bg-background mt-3"></div>
            <div className="flex flex-col gap-1">
              {threads.map((thread, index) => (
                <div className="" key={index}>
                  <SidebarThreads
                    num={index + 1}
                    title={thread.title}
                    createdAt={thread.createdAt}
                    author={thread.author}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-primary rounded-[15px] p-3">
            <div className="flex gap-2 justify-center text-primary-foreground text-xl mb-2 items-center">
              <IoIosRefresh /> Newest Forum <IoIosRefresh />
            </div>
            <div className="h-[2px] w-full bg-background mt-3"></div>
            <div className="flex flex-col gap-1">
              {threads.map((thread, index) => (
                <div className="" key={index}>
                  <SidebarThreads
                    num={index + 1}
                    title={thread.title}
                    createdAt={thread.createdAt}
                    author={thread.author}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 right-4">
        <QuestionModal />
      </div>
    </div>
  );
}
