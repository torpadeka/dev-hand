"use server";

import { db } from "@/db";
import { userProfilesTable } from "@/schema";

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
