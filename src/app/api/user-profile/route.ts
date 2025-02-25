import { NextResponse } from "next/server";
import { getUserProfile } from "@/actions/user-profile-queries";

export async function GET(
    req: Request,
) {
    const { searchParams } = new URL(req.url);
    try {
        const profile = await getUserProfile(Number(searchParams.get("userid")));
        return NextResponse.json(profile, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching profile" },
            { status: 500 }
        );
    }
}
