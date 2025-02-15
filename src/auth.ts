import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SelectUser } from "./schema";
import { getUserByEmail, registerUser } from "./actions/user-queries";
import bcrypt from "bcryptjs";
import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";
import Discord from "@auth/core/providers/discord";
import { randomInt } from "crypto";

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
        async jwt({ token, user }) {
            // When the user is first created, attach the user's ID
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        // This callback is called whenever a session is checked.
        async session({ session, token }) {
            // Attach the user ID from the token to the session
            if (token && session.user) {
                session.user.id = token.id as string;
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
            if (profile && profile.email) {
                const checkUser = await getUserByEmail(profile.email);

                console.log("Checking profile.email:", profile.email);
                console.log("checkUser register", checkUser);

                if (!checkUser) {
                    console.log("Registering from AUTH...");
                    await registerUser({
                        email: profile.email,
                        username:
                            profile.name ||
                            "devhanduser" + randomInt(1000, 99999),
                        password: null,
                    });
                }
            }

            return true;
        },
    },
    session: {
        strategy: "jwt",
    },
});
