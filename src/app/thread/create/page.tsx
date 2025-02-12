// app/thread/create/page.tsx (Server Component)
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/actions/user-queries";
import CreateThreadClient from "./CreateThreadClient";
import { SelectUser } from "@/schema";

export default async function CreateThreadPage() {
  const session = await auth();
  let userID;
  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session && session.user) {
    const getUser = await getUserByEmail(session?.user?.email || "");
    if (getUser !== null) {
      const user: SelectUser = getUser;
      userID = getUser.user_id;
    }
  }

  return <CreateThreadClient userID={userID ? userID : -1} />;
}
