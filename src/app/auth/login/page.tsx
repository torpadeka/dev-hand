"use client";

import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";

import { FaGoogle } from "react-icons/fa";
import { useState } from "react";

const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Cannot be empty!" })
        .max(100, { message: "Cannot exceed 100 characters!" }),
    password: z
        .string()
        .min(1, { message: "Cannot be empty!" })
        .max(255, { message: "Cannot exceed 255 characters!" }),
});

export default function Login() {
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const submitCredentials = async (values: z.infer<typeof formSchema>) => {
        const res = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        if (res && res.error?.startsWith("CUSTOM_")) {
            const encodedMsg = res.error.replace("CUSTOM_", "");
            const decodedMsg = decodeURIComponent(encodedMsg);
            setErrorMessage(decodedMsg);
            return;
        }
    };

    const googleSignIn = () => {
        signIn("google", {
            redirectTo: "/",
        });
    };

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
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(submitCredentials)}
                        className="w-64 h-96 flex flex-col items-center justify-center gap-4 rounded-xl p-6 bg-primary shadow-md"
                    >
                        <div className="text-2xl font-bold text-primary-foreground">
                            Login
                        </div>
                        <div className="flex flex-col items-center gap-8 justify-center">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="h-20">
                                        <FormLabel className="text-primary-foreground">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="text-primary"
                                                {...field}
                                            />
                                        </FormControl>
                                        {/* <FormDescription>
                                This is your email.
                            </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="h-20">
                                        <FormLabel className="text-primary-foreground">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="text-primary"
                                                {...field}
                                                type="password"
                                            />
                                        </FormControl>
                                        {/* <FormDescription>
                                This is your password.
                            </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Button className="mt-4 bg-button" type="submit">
                                Login
                            </Button>
                            <div className="h-4 text-destructive-foreground">
                                {errorMessage}
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
                <Button className="bg-black" onClick={googleSignIn}>
                    <FaGoogle />
                    <div>Sign In with Google</div>
                </Button>
            </div>
        </div>
    );
}
