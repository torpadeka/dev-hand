"use server";

import { db } from "@/db";
import { SelectCategory, categoriesTable } from "@/schema";
import { and, eq } from "drizzle-orm";


export async function selectAllCategoryName(
  ): Promise<string[]> {
    const result: any = await db.select({field1: categoriesTable.category_name}).from(categoriesTable).orderBy(categoriesTable.category_name);
    return result.map((row:any) => row.field1);;
}