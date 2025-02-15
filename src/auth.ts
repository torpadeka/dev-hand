import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SelectUser } from "./schema";
import { getUserByCredentials, getUserByEmail } from "./actions/user-queries";
import bcrypt from "bcryptjs";
import Google from "@auth/core/providers/google";

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

                if(user == null){
                    throw new InvalidCredentialsError("User not found!");
                }

                if (user.password === null) {
                    throw new InvalidCredentialsError(
                        "This email is registered using a provider! Try logging in with a provider instead!"
                    );
                }

                const isMatch = await bcrypt.compare(credentialsPassword, user.password);

                if (!isMatch) {
                    console.log("PASS MISMATCH");
                    throw new InvalidCredentialsError("Invalid credentials!");
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
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if (account?.provider == "credentials") {
                if (!user) {
                    return false;
                }

                // If sign in is successful, just let NextAuth handle it.
                return true;
            }

            if (account?.provider == "google") {
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
