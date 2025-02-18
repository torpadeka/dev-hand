interface ProfilePictureProps {
  link: string | null;
  username: string;
}

export default function ProfilePicture({
  link,
  username,
}: ProfilePictureProps) {
  console.log(link);
  return (
    <div className="">
      {link != null ? (
        <img
          src={link}
          alt=""
          className="bg-popover-foreground w-7 h-7 rounded-full flex items-center justify-center"
        />
      ) : (
        <div className="bg-popover-foreground w-7 h-7 rounded-full flex items-center justify-center">
          {username.charAt(0)}
        </div>
      )}
    </div>
  );
}
