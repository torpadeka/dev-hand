"use client";

import { signIn } from "@/auth";
import { Button } from "./ui/button";
import { FaGoogle } from "react-icons/fa";

export default function LoginOAuthMenu() {
    const googleSignIn = () => {
        signIn("google", {
            redirectTo: "/",
        });
    };

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <Button className="bg-black" onClick={googleSignIn}>
                <FaGoogle />
                <div>Sign In with Google</div>
            </Button>
        </div>
    );
}
