import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { auth } from "@/auth";

export default async function Profile() {
    const session = await auth();

    if (!session?.user) redirect("/login");

    return (
        <>
            <ProfileForm session={session}></ProfileForm>
        </>
    );
}
