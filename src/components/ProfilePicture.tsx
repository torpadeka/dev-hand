interface ProfilePictureProps {
  link: string | null;
  id: number;
  username: string | null;
  size: number;
}

export default function ProfilePicture({
  link,
  username,
  size,
}: ProfilePictureProps) {
  return (
    <div>
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
    </div>
  );
}
