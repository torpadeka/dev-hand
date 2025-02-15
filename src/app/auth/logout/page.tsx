import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Logout() {
    const session = await auth();

    // Check if user is authenticated, if yes simply redirect to Home
    if (!session?.user) {
        redirect("/auth/login");
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-background">
            <div className="space-y-8 rounded-xl p-6 bg-primary">
                <div>Are you sure you want to logout?</div>
                <form
                    className="flex items-center justify-center"
                    action={async (formData) => {
                        "use server";
                        await signOut({ redirectTo: "/auth/login" });
                    }}
                >
                    <Button className="bg-button" type="submit">
                        Log Out
                    </Button>
                </form>
            </div>
        </div>
    );
}
