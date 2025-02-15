import Image from "next/image";

import LoginForm from "@/components/LoginForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Login() {
    const session = await auth();

    // Check if user is authenticated, if yes simply redirect to Home
    if (session?.user) {
        redirect("/");
    }
    
    return (
        <div className="w-screen h-screen flex items-center justify-center gap-8">
            <div className="flex flex-col items-center justify-center gap-4 bg-background">
                <div className="flex flex-col items-center justify-center gap-1">
                    <Image
                        src="/dev-hand.svg"
                        width={60}
                        height={60}
                        alt="#"
                    ></Image>
                    <div className="font-bold text-2xl text-logo">Dev Hand</div>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
