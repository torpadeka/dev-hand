"use server";

import { db } from "@/db";
import { SelectUser, usersTable } from "@/schema";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

type SelectUserType = SelectUser;

export async function getUserByEmail(
    email: string
): Promise<SelectUser | null> {
    const rows: any = await db
        .select()
        .from(usersTable)
        .where(and(eq(usersTable.email, email)));

    return rows[0];
}

export async function registerUser(formData: any) {
    const saltRounds = 10;
    let hashedPassword;

    if (formData.password) {
        hashedPassword = await bcrypt.hash(formData.password, saltRounds);
    } else {
        hashedPassword = null;
    }

    const checkUser: any = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, formData.email));

    if (!checkUser[0]) {
        console.log("REGISTERING");
        await db.insert(usersTable).values({
            username: formData.username,
            email: formData.email,
            password: hashedPassword,
        });

        return { success: true, message: "Register successful!" };
    }

    return {
        success: false,
        message: "This email is already registered!",
    };
}
