import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SelectUser } from "./schema";
import { getUserByCredentials } from "./actions/user-queries";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },

            authorize: async (credentials) => {
                let user: SelectUser | null;

                if (
                    !credentials ||
                    !credentials.email ||
                    !credentials.password
                ) {
                    throw new Error("Missing credentials");
                }
                const { email, password } = credentials as {
                    email: string;
                    password: string;
                };

                const credentialsEmail: string = email;
                const credentialsPassword: string = password;

                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(
                    credentialsPassword,
                    saltRounds
                );

                // debug purposes
                // const hashedPassword = credentialsPassword;
                
                // use server action to try and fetch user
                user = await getUserByCredentials(
                    credentialsEmail,
                    hashedPassword
                );

                console.log("USER: " + user);

                if (!user) {
                    // No user found, so this is their first attempt to login
                    // Optionally, this is also the place you could do a user registration
                    throw new Error("Invalid credentials.");
                }

                // return user object with their profile data
                return user;
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
        error: "/auth/login",
    },
});
