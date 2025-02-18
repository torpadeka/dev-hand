// app/expert-application/page.tsx
import { selectAllCategoryName } from "@/actions/category-queries";
import ExpertApplicationForm from "./ExpertApplicationForm";
import Navbar from "@/components/Navbar";

export default async function ExpertApplicationPage() {
  const categories = await selectAllCategoryName(); // Fetch categories from database

  return (
    <div className="">
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-primary-foreground p-6">
        <h1 className="text-3xl font-bold mb-6">Apply as an Expert</h1>
        <ExpertApplicationForm categoryMap={categories} />
      </div>
    </div>
  );
}
