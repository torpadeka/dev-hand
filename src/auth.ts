import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SelectUser } from "./schema";
import { getUserByCredentials } from "./actions/user-queries";
import bcrypt from "bcryptjs";
import Google from "@auth/core/providers/google";

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
                    return null;
                }

                // return user object with their profile data
                return user;
            },
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
        error: "/auth/login",
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {

            if(account?.provider == "credentials"){
                if (!user) {
                    return "/auth/login?error=InvalidCredentials";
                }
    
                // If sign in is successful, just let NextAuth handle it.
                return true;
            }

            if(account?.provider == "google"){

                

                return true;
            }

            // the code should never reach this point, but this is added
            // to prevent errors
            return false;
        },
    },
    session: {
        strategy: "jwt",
    },
});
