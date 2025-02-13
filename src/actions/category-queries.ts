"use server";

import { db } from "@/db";
import { SelectCategory, categoriesTable } from "@/schema";
import { and, eq } from "drizzle-orm";


export async function selectAllCategoryName(): Promise<Map<number, string>> {
  const result = await db
    .select({
      id: categoriesTable.category_id,
      name: categoriesTable.category_name,
    })
    .from(categoriesTable)
    .orderBy(categoriesTable.category_name);

  // ✅ Convert the array into a Map (id -> name)
  return new Map(result.map(row => [row.id, row.name]));
}

