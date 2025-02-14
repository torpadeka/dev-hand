import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SelectUser } from "./schema";
import { getUserByCredentials, getUserByEmail } from "./actions/user-queries";
import bcrypt from "bcryptjs";
import Google from "@auth/core/providers/google";

export class InvalidCredentialsError extends AuthError {
    constructor(message: string) {
        super();
        this.message = message;
    }
}

// export class EmailAlreadyExistsError extends AuthError {
//     code = "email_already_exists";
//     errorMessage: string;
//     constructor(message?: any, errorOptions?: any) {
//         super(message, errorOptions);
//         this.errorMessage = message;
//     }
// }

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
                    throw new Error("User Not Found!");
                }

                if (user.password === null) {
                    throw new InvalidCredentialsError(
                        "This email is registered using a provider! Try logging in with a provider instead!"
                    );
                }

                const isMatch = await bcrypt.compare(credentialsPassword, user.password);

                if (!isMatch) {
                    throw new Error("Invalid Credentials");
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
