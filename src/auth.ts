import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SelectUser } from "./schema";
import { getUserByEmail, registerUser } from "./actions/user-queries";
import bcrypt from "bcryptjs";
import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";
import Discord from "@auth/core/providers/discord";
import { randomInt } from "crypto";
import { createUserProfile } from "./actions/user-profile-queries";

class InvalidCredentialsError extends AuthError {
    constructor(message: string) {
        super();
        this.message = message;
    }
}

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
                    throw new InvalidCredentialsError("Missing credentials");
                }
                const { email, password } = credentials as {
                    email: string;
                    password: string;
                };

                const credentialsEmail: string = email;
                const credentialsPassword: string = password;

                // debug purposes
                // const hashedPassword = credentialsPassword;

                // use server action to try and fetch user
                user = await getUserByEmail(credentialsEmail);

                if (user == null) {
                    throw new InvalidCredentialsError("User not found!");
                }

                if (user.password === null) {
                    throw new InvalidCredentialsError(
                        "This email was registered using an OAuth provider and has no password set! Try logging in with a provider instead!"
                    );
                }

                const isMatch = await bcrypt.compare(
                    credentialsPassword,
                    user.password
                );

                if (!isMatch) {
                    console.log("PASS MISMATCH");
                    throw new InvalidCredentialsError("Invalid credentials!");
                }

                // return user object with their profile data
                // Map user_id to id so NextAuth knows it
                return { ...user, id: user.user_id.toString() };
            },
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name,
                    userName: profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                };
            },
        }),
        Discord({
            clientId: process.env.AUTH_DISCORD_ID,
            clientSecret: process.env.AUTH_DISCORD_SECRET,
        }),
    ],
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
    },
    callbacks: {
        // This callback is called whenever a JSON Web Token is created or updated.
        async jwt({ token, user, account }) {
            if (account && user) {
                // Check for account to know if it's an OAuth sign-in
                console.log("JWT User from provider:", JSON.stringify(user));
                console.log(
                    "JWT Account from provider:",
                    JSON.stringify(account)
                );

                // For all providers, we want token.id to be our internal DB user ID string
                if (user.email) {
                    const dbUser = await getUserByEmail(user.email); // Fetch user from your DB
                    if (dbUser) {
                        token.id = dbUser.user_id.toString(); // Use your DB user_id
                        token.email = dbUser.email;
                        token.name = dbUser.username; // Or dbUser.name if you have it
                        // Add other DB user fields to token if needed
                    } else {
                        // This case should ideally be handled by the signIn callback creating the user.
                        // If dbUser is not found here after signIn, it's an issue.
                        console.error(
                            "JWT: DB user not found for email:",
                            user.email
                        );
                        // You might prevent token creation or handle as an error
                        return {}; // Return an empty token or throw to indicate failure
                    }
                }
            }
            // This part is for subsequent JWT reads, not initial creation with 'user' object
            // 'token.id' should already be set correctly from the above block on first sign-in.
            return token;
        },
        async session({ session, token }) {
            if (token?.id && session.user) {
                session.user.id = token.id as string; // This will be your DB user_id string
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                // Assign other properties from token to session.user
            }
            return session;
        },
        async signIn({ user, account, profile, email, credentials }) {
            if (account?.provider == "credentials") {
                if (!user) {
                    return false;
                }

                // If sign in is successful, just let NextAuth handle it.
                return true;
            }

            // if using OAuth
            if (user && user.email) {
                const checkUser = await getUserByEmail(user.email);

                if (!checkUser) {
                    await registerUser({
                        email: user.email,
                        username:
                            user.name || "devhanduser" + randomInt(1000, 99999),
                        password: null,
                    });

                    let userId = (await getUserByEmail(user.email))?.user_id;
                    let profilePicture = user.image || null;
                    let githubLink: string | null = null;

                    if (account?.provider === "github") {
                        githubLink = "https://github.com/" + profile!.userName;
                    }

                    await createUserProfile(
                        userId!,
                        profilePicture,
                        githubLink
                    );
                }
            }

            return true;
        },
    },
    session: {
        strategy: "jwt",
    },
});
