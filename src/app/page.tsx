import Navbar from "@/components/Navbar";
import ThreadCard from "@/components/ThreadCard";
import ThreadPost from "@/components/ThreadCard";

const threads = [
  {
    title:
      "How to create a design system and what is the purpose of design system?",
    category: ["Completed", "Dynamic Programming", "Graph Theory"],
    votes: 7,
    comments: 1,
    date: "2 days ago",
  },
  {
    title: "Best Practices in UI Design",
    category: ["Greedy", "Graph Theory", "Dynamic Programming"],
    votes: 3,
    comments: 5,
    date: "Apr 14",
  },
];

export default async function Home() {
  return (
    <div className="w-screen h-screen bg-background">
      <Navbar></Navbar>

      <div className="mt-4 space-y-4 m-10 w-2/3">
        {threads.map((thread, index) => (
          <ThreadCard key={index} {...thread} />
        ))}
      </div>
    </div>
  );
}
