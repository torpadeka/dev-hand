import { signOut } from "@/auth";

export default function Logout() {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-background">
            <div className="space-y-8 rounded-xl p-6 bg-primary">
                <div>Are you sure you want to logout?</div>
                <form
                    action={async (formData) => {
                        "use server";
                        await signOut();
                    }}
                >
                    <button type="submit">Sign out</button>
                </form>
            </div>
        </div>
    );
}
