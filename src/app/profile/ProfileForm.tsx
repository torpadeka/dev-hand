import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function ProfileForm({ session }: { session: any }) {
    return (
        <div className="w-screen h-screen bg-primary">
            <Navbar />
            <div className="w-screen py-20 flex items-center justify-center gap-64">
                <div className="flex flex-col items-center justify-center gap-4">
                    <Avatar className="mb-16 scale-[3] border-2 border-foreground">
                        <AvatarImage
                            src={session?.user?.image || ""}
                        ></AvatarImage>
                        <AvatarFallback>DH</AvatarFallback>
                    </Avatar>
                    <div className="w-72 flex items-center justify-center gap-4">
                        <span className="w-36">Username</span>
                        <Input></Input>
                    </div>
                    <div className="w-72 flex items-center justify-center gap-4">
                        <span className="w-36">About Me</span>
                        <Input></Input>
                    </div>
                    <div className="w-72 flex items-center justify-center gap-4">
                        <span className="w-36">Status</span>
                        <Input></Input>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-72 flex items-center justify-center gap-4">
                        <span className="w-36">Location</span>
                        <Input></Input>
                    </div>
                    <div className="w-72 flex items-center justify-center gap-4">
                        <span className="w-36">Personal Website</span>
                        <Input></Input>
                    </div>
                    <div className="w-72 flex items-center justify-center gap-4">
                        <span className="w-36">GitHub</span>
                        <Input></Input>
                    </div>
                    <div className="w-72 flex items-center justify-center gap-4">
                        <span className="w-36">LinkedIn</span>
                        <Input></Input>
                    </div>
                </div>
            </div>
        </div>
    );
}
