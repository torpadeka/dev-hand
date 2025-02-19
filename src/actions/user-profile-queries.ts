"use server";

import { db } from "@/db";
import { userProfilesTable } from "@/schema";
import { eq } from "drizzle-orm";

export async function createUserProfile(
    userId: number,
    profile_picture: string | null,
    github: string | null
) {
    await db.insert(userProfilesTable).values({
        user_id: userId,
        profile_picture: profile_picture,
        github: github,
    });
}

export async function getUserProfile(userId: number) {
    const rows = await db
        .select()
        .from(userProfilesTable)
        .where(eq(userProfilesTable.user_id, userId));
    console.log(rows[0])
    return rows[0];
}
