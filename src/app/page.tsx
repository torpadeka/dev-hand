import { selectAllCategoryName } from "@/actions/category-queries";
import HomeClient from "./HomeClient";

export default async function Home() {
  const categories = await selectAllCategoryName(); // ✅ Fetch categories at the server level

  return <HomeClient categories={categories} />;
}
