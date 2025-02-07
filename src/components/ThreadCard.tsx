interface ThreadCardProps {
  title: string;
  category: string;
  votes: number;
  comments: number;
  date: string;
}

export default function ThreadCard({
  title,
  category,
  votes,
  comments,
  date,
}: ThreadCardProps) {
  return (
    <>
      <div className="p-4 bg-card rounded-xl flex justify-between items-center shadow-md">
        <div>
          <h3 className="text-card-foreground font-semibold">{title}</h3>
          <span className="text-sm text-card-foreground/70">{category}</span>
        </div>
        <div className="flex gap-3 text-card-foreground/70">
          <span>🔼 {votes}</span>
          <span>💬 {comments}</span>
          <span>{date}</span>
        </div>
      </div>
    </>
  );
}
