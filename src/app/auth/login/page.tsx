"use client";

import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSearchParams } from "next/navigation";

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
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

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
            // e.g., callbackUrl: '/dashboard'
            redirect: true,
        });
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-background">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 rounded-xl p-6 bg-primary"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
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
                            <FormItem>
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
                    {error && (
                        <div style={{ color: "red" }}>Invalid credentials!</div>
                    )}
                    <Button className="bg-button" type="submit">
                        Login
                    </Button>
                </form>
            </Form>
        </div>
    );
}
