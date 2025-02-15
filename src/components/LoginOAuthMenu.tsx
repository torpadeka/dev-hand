"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";

export default function LoginOAuthMenu() {
    const googleSignIn = () => {
        signIn("google", {
            redirectTo: "/",
        });
    };

    const githubSignIn = () => {
        signIn("github", {
            redirectTo: "/",
        });
    };

    const discordSignIn = () => {
        signIn("discord", {
            redirectTo: "/",
        });
    };

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="text-2xl mb-4 text-primary-foreground">
                Or Sign In using OAuth
            </div>
            <Button
                className="w-44 flex items-center justify-start bg-black"
                onClick={googleSignIn}
            >
                <FaGoogle />
                <div>Sign In with Google</div>
            </Button>
            <Button
                className="w-44 flex items-center justify-start bg-black"
                onClick={githubSignIn}
            >
                <FaGithub />
                <div>Sign In with Github</div>
            </Button>
            <Button
                className="w-44 flex items-center justify-start bg-black"
                onClick={discordSignIn}
            >
                <FaDiscord />
                <div>Sign In with Discord</div>
            </Button>
            <div className="text-lg mt-4">
                Faster, easier, and safer
            </div>
        </div>
    );
}
