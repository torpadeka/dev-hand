import { getTimeAgo } from "@/app/utils/timeAgo";
import ProfilePicture from "./ProfilePicture";

interface ReplyCardProps {
  reply: Reply;
}

export default function ReplyCard({ reply }: ReplyCardProps) {
  let timeAgo = getTimeAgo(reply.created_at);
  console.log(reply);
  return (
    <div className="flex mx-4 py-1 gap-3 border-0 ">
      <div className="flex items-start">
        <ProfilePicture
          id={reply.user.id}
          link={reply.user.profile_picture}
          username={reply.user.username}
          size={6}
        />
      </div>
      <div className="w-4/5 flex items-center">
        <div
          className="w-full text-start text-sm break-words"
          dangerouslySetInnerHTML={{ __html: reply.content }}
        ></div>
      </div>

      {/* <div className="flex text-sm text-foreground gap-3">
        <div className="">by {reply.user.username}</div>
        <div className="">{timeAgo}</div>
      </div> */}
    </div>
  );
}
