"use client";

import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

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

function ErrorMessage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return error && <div style={{ color: "red" }}>Invalid credentials!</div>;
}

export default function Login() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirectTo: "/",
            redirect: true,
        });
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 bg-background">
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
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="h-80 flex flex-col items-center gap-8 justify-center rounded-xl p-6 bg-primary"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="h-20">
                                <FormLabel>Username</FormLabel>
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
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        className="text-primary"
                                        {...field}
                                    />
                                </FormControl>
                                {/* <FormDescription>
                                This is your password.
                            </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Suspense>
                        <ErrorMessage></ErrorMessage>
                    </Suspense>
                    <Button className="mt-4 bg-button" type="submit">
                        Login
                    </Button>
                </form>
            </Form>
        </div>
    );
}
