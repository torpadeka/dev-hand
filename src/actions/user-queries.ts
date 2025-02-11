"use server";

import { db } from "@/db";
import { SelectUser, usersTable } from "@/schema";
import { and, eq } from "drizzle-orm";

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
