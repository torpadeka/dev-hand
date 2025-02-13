import { getAllThreadsWithCategories } from "@/actions/thread-queries";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1; // ✅ Default to page 1
  const limit = Number(searchParams.get("limit")) || 10; // ✅ Default 10 per page
  const selectedCategories = searchParams.get("categories")?.split(",") || []; // ✅ Get selected categories
  const selectedCategoryIds = selectedCategories
  .map(Number) // Convert each item to a number
  .filter(id => !isNaN(id));
  const threadsData = await getAllThreadsWithCategories(page, limit, selectedCategoryIds);


  return NextResponse.json(threadsData);
}
