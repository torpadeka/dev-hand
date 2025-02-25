import { useState } from "react";
import ProfileCard from "./ProfileCard";
import { getUserProfile } from "@/actions/user-profile-queries";

interface ProfilePictureProps {
  link: string | null;
  id: number;
  username: string | null;
  size: number;
}

export async function fetchUserProfile(userId: number) {
  return await getUserProfile(userId);
}

export default function ProfilePicture({
  link,
  username,
  id,
  size,
}: ProfilePictureProps) {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // Trigger fetching when the mouse enters.
  const handleMouseEnter = async () => {
    setShowProfileCard(true);
    if (!profile) {
      try {
        const res = await fetch(`/api/user-profile?userid=${id}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const fetchedProfile = await res.json();
        setProfile(fetchedProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
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
        <div className="absolute z-10">
          {profile ? (
            <ProfileCard userProfile={profile} username={username || ""} />
          ) : (
            <div className="w-72 h-72 flex items-center justify-center bg-background border-primary border-4 rounded-lg">
              Loading...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
