import { NextResponse } from "next/server";
import { getUserProfile } from "@/actions/user-profile-queries";

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const profile = await getUserProfile(Number(params.userId));
        return NextResponse.json(profile, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching profile" },
            { status: 500 }
        );
    }
}
