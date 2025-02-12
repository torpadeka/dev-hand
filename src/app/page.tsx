import { selectAllCategoryName } from "@/actions/category-queries";
import HomeClient from "./HomeClient";
import { getAllThreadsWithCategories } from "@/actions/thread-queries";

export default async function Home() {
  const categories = await selectAllCategoryName();
  const threads = await getAllThreadsWithCategories();

  return <HomeClient categories={categories} threads={threads} />;
}
