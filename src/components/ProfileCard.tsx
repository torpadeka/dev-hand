import { getUserProfile } from "@/actions/user-profile-queries";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaUser } from "react-icons/fa";
import Image from "next/image";

export default async function ProfileCard({
    userId,
    username,
}: {
    userId: number;
    username: string;
}) {
    const userProfile = await getUserProfile(userId);

    return (
        <div className="w-72 h-72 relative flex flex-col items-center justify-start bg-background border-primary border-4 rounded-lg">
            <div className="w-full h-28 bg-foreground rounded-t-sm rounded-l-sm rounded-r-sm rounded-b-none">
                <Image src={userProfile.banner!} alt=""></Image>
            </div>
            <div className="absolute left-7 top-24 scale-125">
                <Avatar className="border-2 border-background scale-150">
                    <AvatarImage
                        src={userProfile.profile_picture!}
                    ></AvatarImage>
                    <AvatarFallback className="bg-black">
                        <FaUser
                            className="mt-2"
                            color="white"
                            size={30}
                        ></FaUser>
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="w-32 h-10 px-2 py-1 absolute right-8 top-24 scale-125 bg-primary rounded-xl text-primary-foreground text-[10px]">
                {userProfile.status!}
            </div>
            <div className="w-full pt-12 px-4 text-xl text-primary-foreground font-bold">
                {username}
            </div>
            <div className="w-full px-4 py-2 text-sm text-primary-foreground">
                {userProfile.about_me!}
            </div>
        </div>
    );
}
