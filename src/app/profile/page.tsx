import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { auth } from "@/auth";

export default async function Profile() {
    const session = await auth();

    if (!session?.user) redirect("/login");
    console.log("Session User:", session.user.id);

    return (
        <>
            <ProfileForm session={session}></ProfileForm>
        </>
    );
}
