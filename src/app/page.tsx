import { selectAllCategoryName } from "@/actions/category-queries";
import HomeClient from "./HomeClient";
import { getAllThreadsWithCategories } from "@/actions/thread-queries";
import { auth } from "@/auth";

export default async function Home() {
  const categories = await selectAllCategoryName();
  const session = await auth();
  // const threads = await getAllThreadsWithCategories();

  return <HomeClient categories={categories} session={session} />;
}
