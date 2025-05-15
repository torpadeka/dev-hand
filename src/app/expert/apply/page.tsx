// app/expert-application/page.tsx
import { selectAllCategoryName } from "@/actions/category-queries";
import ExpertApplicationForm from "./ExpertApplicationForm";
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserByEmail } from "@/actions/user-queries";

export default async function ExpertApplicationPage() {
  const session = await auth();
  if (!session?.user) {
    return redirect("/auth/login"); // ✅ Redirect early
  }

  const [categories, getUser] = await Promise.all([
    selectAllCategoryName(),
    getUserByEmail(session.user.email || ""),
  ]);

  if (!getUser) {
    return redirect("/auth/login");
  }

  return (
    <div className="">
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-primary-foreground p-6">
        <h1 className="text-3xl font-bold mb-6">Apply as an Expert</h1>
        <ExpertApplicationForm
          categoryMap={categories}
          userID={getUser.user_id}
        />
      </div>
    </div>
  );
}
