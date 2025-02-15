"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { authenticateCredentials } from "@/actions/authenticate-credentials";
import { registerUser } from "@/actions/user-queries";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    email: z
        .string()
        .email({ message: "This is not a valid email!" })
        .min(1, { message: "Cannot be empty!" })
        .max(100, { message: "Cannot exceed 100 characters!" }),
    username: z
        .string()
        .regex(
            new RegExp(
                /^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/\?][^!@$%^*+=\[\]{};:\\|<>\?]*$/
            ),
            { message: "Cannot contain special characters!" }
        )
        .min(5, { message: "Must at least be 5 characters!" })
        .max(30, { message: "Cannot exceed 30 characters!" }),
    password: z
        .string()
        .min(6, { message: "Must at least be 6 characters!" })
        .max(255, { message: "Cannot exceed 255 characters!" }),
});

export default function RegisterForm() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        if (errorMessage !== "") {
            toast({
                title: "Oops!",
                description: errorMessage,
            });
        }
    }, [errorMessage]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const submitCredentials = async (values: z.infer<typeof formSchema>) => {
        const res = await registerUser({
            username: values.username,
            email: values.email,
            password: values.password,
        });

        if (res.success === false) {
            setErrorMessage(res.message);
            return;
        }

        // if register is successful, automatically login the user using Credentials
        try {
            const res = await authenticateCredentials({
                email: values.email,
                password: values.password,
            });

            if (res.message === "Login successful!") {
                console.log("LOGGED IN!");
                router.push("/");
            }

            if (res.error) {
                setErrorMessage(res.error?.message);
            }
        } catch (error: any) {
            setErrorMessage("Something went wrong!");
        }
    };

    return (
        <Form {...form}>
            <form
                method="POST"
                onSubmit={form.handleSubmit(submitCredentials)}
                className="w-64 h-[28rem] flex flex-col items-center justify-center gap-4 rounded-xl p-6 bg-primary shadow-md"
            >
                <div className="text-2xl font-bold text-primary-foreground">
                    Register
                </div>
                <div className="flex flex-col items-center gap-4 justify-center">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem className="h-20">
                                <FormLabel className="text-primary-foreground">
                                    Username
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
                <div className="flex flex-col items-center justify-center gap-3 mt-4">
                    <Button className="bg-button" type="submit">
                        Register
                    </Button>
                </div>
            </form>
        </Form>
    );
}
