"use server";

import { signIn } from "@/auth";

export async function authenticateCredentials(formData: any) {
    try {
        const session = await signIn(
            "credentials",
            {
                email: formData.email,
                password: formData.password,
                redirect: false,
            },
        );
        return { success: true, message: "Login successful!" };
    } catch (err: any) {
        return {
            error: { message: err.message },
        };
    }
}
