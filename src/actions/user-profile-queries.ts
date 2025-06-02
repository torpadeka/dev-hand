"use server";

import { db } from "@/db";
import { SelectUserProfile, userProfilesTable } from "@/schema";
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


// Define the type for data that can be updated by the user via the form
// Excludes system-managed fields and user_id
type EditableUserProfileFields = {
    profile_picture?: string | null;
    about_me?: string | null;
    banner?: string | null;
    status?: string | null;
    personal_website?: string | null;
    github?: string | null;
    linkedin?: string | null;
};

export async function updateUserProfile(
    userId: number,
    data: EditableUserProfileFields
): Promise<SelectUserProfile | undefined> {
    if (Object.keys(data).length === 0) {
        console.warn("updateUserProfile called with no data for user ID:", userId);
        return getUserProfile(userId); // Return current profile if no data to update
    }

    // Drizzle's .set() method handles undefined fields by not including them in the update statement.
    // Explicit null values will set the database field to NULL.
    await db
        .update(userProfilesTable)
        .set(data)
        .where(eq(userProfilesTable.user_id, userId));

    // Fetch and return the updated profile to confirm changes and get any DB-side transformations
    const updatedRows = await db
        .select()
        .from(userProfilesTable)
        .where(eq(userProfilesTable.user_id, userId));
    
    if (updatedRows.length > 0) {
        return updatedRows[0];
    } else {
        console.warn(`No profile found for user ID ${userId} to update, or update failed to apply.`);
        // This could mean the profile doesn't exist.
        // Consider if createUserProfile should be called instead by the client if it's a new profile.
        return undefined;
    }
}