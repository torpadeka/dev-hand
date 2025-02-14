// app/thread/create/page.tsx (Server Component)
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/actions/user-queries";
import CreateThreadClient from "./CreateThreadClient";
import { selectAllCategoryName } from "@/actions/category-queries";

export default async function CreateThreadPage() {
  const session = await auth();
  if (!session?.user) {
    return redirect("/auth/login"); // ✅ Redirect early
  }

  const [categories, getUser] = await Promise.all([
    selectAllCategoryName(),
    getUserByEmail(session.user.email || ""),
  ]); // ✅ Run both queries in parallel

  if (!getUser) {
    return redirect("/auth/login"); // ✅ Extra safety check
  }

  return (
    <CreateThreadClient userID={getUser.user_id} categories={categories} />
  );
}
