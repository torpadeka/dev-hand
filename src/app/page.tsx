import Navbar from "@/components/Navbar";
import ThreadCard from "@/components/ThreadCard";
import ThreadPost from "@/components/ThreadCard";

const threads = [
  {
    title: "How to create a design system?",
    category: "Completed",
    votes: 7,
    comments: 1,
    date: "2 days ago",
  },
  {
    title: "Best Practices in UI Design",
    category: "Bug",
    votes: 3,
    comments: 5,
    date: "Apr 14",
  },
];

export default async function Home() {
  return (
    <div className="w-screen h-screen bg-background">
      <Navbar></Navbar>

      <div className="mt-4 space-y-4 m-10">
        {threads.map((thread, index) => (
          <ThreadCard key={index} {...thread} />
        ))}
      </div>
    </div>
  );
}
