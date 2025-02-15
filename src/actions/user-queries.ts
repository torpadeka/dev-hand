"use server";

import { db } from "@/db";
import { SelectUser, usersTable } from "@/schema";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

type SelectUserType = SelectUser;

export async function getUserByCredentials(
    email: string,
    password: string
): Promise<SelectUser | null> {
    const rows: any = await db
        .select()
        .from(usersTable)
        .where(
            and(eq(usersTable.email, email), eq(usersTable.password, password))
        );

    return rows[0];
}

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
    const hashedPassword = await bcrypt.hash(formData.password, saltRounds);

    const checkUser: any = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, formData.email));

    console.log(formData.email)
    console.log(checkUser[0])

    if (checkUser[0] == null) {
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
