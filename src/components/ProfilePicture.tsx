import { useState } from "react";
import ProfileCard from "./ProfileCard";

interface ProfilePictureProps {
  link: string | null;
  id: number;
  username: string | null;
  size: number;
}

export default function ProfilePicture({
  link,
  username,
  id,
  size,
}: ProfilePictureProps) {
  const [showProfileCard, setShowProfileCard] = useState(false);
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowProfileCard(true)}
      onMouseLeave={() => setShowProfileCard(false)}
    >
      {link ? (
        <img
          src={link}
          alt=""
          className={`rounded-full bg-popover-foreground w-${size} h-${size}`}
        />
      ) : (
        <div
          className={`rounded-full font-bold bg-popover-foreground flex items-center justify-center 
                      w-${size} h-${size} text-${size * 0.4}`}
        >
          {username?.charAt(0)}
        </div>
      )}
      {showProfileCard && (
        <div className="absolute top-full left-0 mt-2 z-10">
          <ProfileCard userId={id} username={username || ""} />
        </div>
      )}
    </div>
  );
}
