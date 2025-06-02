"use client";

import Navbar from "@/components/Navbar"; // Adjust path as needed
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Adjust path
import { Input } from "@/components/ui/input"; // Adjust path
import { Button } from "@/components/ui/button"; // Adjust path, ensure you have this component
import { Textarea } from "@/components/ui/textarea"; // For multi-line fields like 'about_me'
import { useEffect, useState, FormEvent } from "react";
// Adjust the path to your server actions file
import {
    getUserProfile,
    updateUserProfile,
} from "@/actions/user-profile-queries"; // EXAMPLE PATH
import type { SelectUserProfile } from "@/schema"; // Adjust path

// This type should match EditableUserProfileFields from the queries file
type UserProfileFormData = {
    profile_picture?: string | null;
    about_me?: string | null;
    banner?: string | null;
    status?: string | null;
    personal_website?: string | null;
    github?: string | null;
    linkedin?: string | null;
};

export default function ProfileForm({ session }: { session: any }) {
    // Initialize with default structure, including all fields
    const initialProfileState: UserProfileFormData = {
        profile_picture: null,
        about_me: null,
        banner: null,
        status: null,
        personal_website: null,
        github: null,
        linkedin: null,
    };
    const [profile, setProfile] =
        useState<UserProfileFormData>(initialProfileState);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const userId = session?.user?.id; // Assuming user ID is available in the session object

    console.log(userId);

    useEffect(() => {
        if (!userId) {
            setError("User not authenticated. Please log in.");
            setIsLoading(false);
            return;
        }

        async function fetchProfile() {
            setIsLoading(true);
            setError(null);
            try {
                const userProfileData: SelectUserProfile | undefined =
                    await getUserProfile(Number(userId));
                if (userProfileData) {
                    setProfile({
                        profile_picture: userProfileData.profile_picture,
                        about_me: userProfileData.about_me,
                        banner: userProfileData.banner,
                        status: userProfileData.status,
                        personal_website: userProfileData.personal_website,
                        github: userProfileData.github,
                        linkedin: userProfileData.linkedin,
                    });
                } else {
                    // Profile doesn't exist, form will be empty or use defaults.
                    // You might want specific logic here if a new profile should be implicitly created on save.
                    // For now, we assume `updateUserProfile` updates an existing one.
                    // `createUserProfile` would be needed if it's a first-time setup.
                    setProfile((prev) => ({
                        ...prev,
                        profile_picture: session?.user?.image || null,
                    })); // Pre-fill avatar from session
                    // setError("Profile not found. You might need to create one first.");
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError("Failed to load profile data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchProfile();
        fetch(profile.profile_picture!);
    }, [userId, session?.user?.image]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value, // Store empty string as is, backend will handle conversion to null if needed
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!userId) {
            setError("User not authenticated. Cannot update profile.");
            return;
        }
        setError(null);
        setSuccessMessage(null);
        setIsSaving(true);

        const dataToUpdate: UserProfileFormData = {
            profile_picture: profile.profile_picture || null,
            about_me: profile.about_me || null,
            banner: profile.banner || null,
            status: profile.status || null,
            personal_website: profile.personal_website || null,
            github: profile.github || null,
            linkedin: profile.linkedin || null,
        };

        try {
            const updatedProfile = await updateUserProfile(
                Number(userId),
                dataToUpdate
            );
            if (updatedProfile) {
                // Update form state with data returned from server (e.g., if server cleans/transforms data)
                setProfile({
                    profile_picture: updatedProfile.profile_picture,
                    about_me: updatedProfile.about_me,
                    banner: updatedProfile.banner,
                    status: updatedProfile.status,
                    personal_website: updatedProfile.personal_website,
                    github: updatedProfile.github,
                    linkedin: updatedProfile.linkedin,
                });
                setSuccessMessage("Profile updated successfully!");
            } else {
                // This might occur if the profile didn't exist and updateUserProfile couldn't find it.
                setError(
                    "Failed to update profile. The profile may not exist or an error occurred."
                );
            }
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError(
                "An unexpected error occurred while saving. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading)
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-primary text-foreground">
                <p>Loading profile...</p>
            </div>
        );

    return (
        <div className="w-screen min-h-screen bg-primary text-foreground pb-20">
            <Navbar />
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-center mb-12">
                    Edit Your Profile
                </h1>
                {error && (
                    <p className="text-red-500 text-center mb-4">{error}</p>
                )}
                {successMessage && (
                    <p className="text-green-500 text-center mb-4">
                        {successMessage}
                    </p>
                )}

                {!userId && !isLoading && (
                    <div className="text-center">
                        Please log in to edit your profile.
                    </div>
                )}

                {userId && (
                    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                            {/* Left Column: Avatar & Basic Info */}
                            <div className="flex-shrink-0 w-full md:w-1/3 flex flex-col items-center gap-6">
                                <Avatar className="w-40 h-40 md:w-48 md:h-48 border-4 border-foreground shadow-lg">
                                    <AvatarImage
                                        src={
                                            profile.profile_picture ||
                                            session?.user?.image ||
                                            ""
                                        }
                                        alt={
                                            session?.user?.name || "User Avatar"
                                        }
                                    />
                                    <AvatarFallback className="text-4xl">
                                        {session?.user?.name
                                            ?.substring(0, 2)
                                            .toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="w-full">
                                    <label
                                        htmlFor="profile_picture"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        Profile Picture URL
                                    </label>
                                    <Input
                                        id="profile_picture"
                                        name="profile_picture"
                                        type="url"
                                        value={profile.profile_picture || ""}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.png"
                                        className="bg-background border-border"
                                    />
                                </div>
                                <div className="w-full">
                                    <label
                                        htmlFor="username"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        Username
                                    </label>
                                    <Input
                                        id="username"
                                        value={session?.user?.name || "N/A"}
                                        disabled
                                        className="bg-muted border-border"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Detailed Info */}
                            <div className="flex-grow w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="about_me"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        About Me
                                    </label>
                                    <Textarea
                                        id="about_me"
                                        name="about_me"
                                        rows={4}
                                        value={profile.about_me || ""}
                                        onChange={handleChange}
                                        placeholder="Tell us a bit about yourself..."
                                        className="bg-background border-border"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="banner"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        Banner Image URL
                                    </label>
                                    <Input
                                        id="banner"
                                        name="banner"
                                        type="url"
                                        value={profile.banner || ""}
                                        onChange={handleChange}
                                        placeholder="https://example.com/banner.png"
                                        className="bg-background border-border"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="status"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        Status
                                    </label>
                                    <Input
                                        id="status"
                                        name="status"
                                        value={profile.status || ""}
                                        onChange={handleChange}
                                        placeholder="What are you currently up to?"
                                        className="bg-background border-border"
                                    />
                                </div>
                                {/* Location: Not in current schema for userProfilesTable */}
                                {/* <div>
                                    <label htmlFor="location" className="block text-sm font-medium mb-1">Location (Display Only)</label>
                                    <Input id="location" placeholder="City, Country" className="bg-background border-border" />
                                </div> */}
                                <div>
                                    <label
                                        htmlFor="personal_website"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        Personal Website
                                    </label>
                                    <Input
                                        id="personal_website"
                                        name="personal_website"
                                        type="url"
                                        value={profile.personal_website || ""}
                                        onChange={handleChange}
                                        placeholder="https://your-website.com"
                                        className="bg-background border-border"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="github"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        GitHub Profile
                                    </label>
                                    <Input
                                        id="github"
                                        name="github"
                                        type="url"
                                        value={profile.github || ""}
                                        onChange={handleChange}
                                        placeholder="https://github.com/yourusername"
                                        className="bg-background border-border"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="linkedin"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        LinkedIn Profile
                                    </label>
                                    <Input
                                        id="linkedin"
                                        name="linkedin"
                                        type="url"
                                        value={profile.linkedin || ""}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/in/yourusername"
                                        className="bg-background border-border"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 text-center">
                            <Button
                                type="submit"
                                disabled={isSaving || !userId}
                                className="px-10 py-3 text-lg"
                            >
                                {isSaving ? "Saving..." : "Save Profile"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
