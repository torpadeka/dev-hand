import { getTimeAgo } from "@/app/utils/timeAgo";

interface ReplyCardProps {
  reply: Reply;
}

export default function ReplyCard({ reply }: ReplyCardProps) {
  let timeAgo = getTimeAgo(reply.created_at);
  console.log(reply);
  return (
    <div className="flex flex-col mx-4 border-0 border-b-[1px] border-primary-foreground">
      <div
        className="w-4/5 text-start"
        dangerouslySetInnerHTML={{ __html: reply.content }}
      ></div>
      <div className="flex text-sm text-foreground gap-3">
        <div className="">by {reply.user.username}</div>
        <div className="">{timeAgo}</div>
      </div>
    </div>
  );
}
