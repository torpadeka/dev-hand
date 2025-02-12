// app/thread/create/page.tsx (Server Component)
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/actions/user-queries";
import CreateThreadClient from "./CreateThreadClient";
import { SelectUser } from "@/schema";
import { selectAllCategoryName } from "@/actions/category-queries";

export default async function CreateThreadPage() {
  const session = await auth();
  const categories = await selectAllCategoryName();
  let getUser;

  if (!session?.user) {
    redirect("/auth/login");
  }
  if (session && session?.user) {
    getUser = await getUserByEmail(session?.user?.email || "");
    console.log(getUser?.user_id);
    if (getUser) {
      return (
        <CreateThreadClient userID={getUser.user_id} categories={categories} />
      );
    }
  }
}
