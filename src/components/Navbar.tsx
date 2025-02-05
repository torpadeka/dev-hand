import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Navbar() {
    return (
        <div className="w-full h-20 flex items-center justify-between px-4 border-b-2 border-gray-800 bg-black">
            <div className="flex items-center justify-center gap-2">
                <Image
                    src="./dev-hand.svg"
                    width={48}
                    height={48}
                    alt="#"
                ></Image>
                <div className="font-bold text-2xl text-[#3488fa]">
                    Dev Hand
                </div>
            </div>
            <div>
                <Avatar>
                    <AvatarImage src="./dev-hand.svg"></AvatarImage>
                    <AvatarFallback>
                        <Image src="./dev-hand.svg" alt="DH"></Image>
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
}
