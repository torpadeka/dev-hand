import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  expertApplicationsTable,
  expertApplicationCategoriesTable,
  expertApplicationCertificatesTable,
  categoriesTable,
  InsertExpertApplicationCategory,
  InsertExpertApplicationCertificate,
} from "@/schema";
import { eq, inArray } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      user_id,
      full_name,
      github_link,
      about_self,
      reason,
      additional_info,
      expertise_category_names,
      certificate_urls,
      certificate_descriptions,
    } = body;

    if (
      !full_name ||
      !expertise_category_names?.length ||
      !certificate_urls?.length ||
      certificate_urls.length !== certificate_descriptions.length
    ) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const matchingCategories = await db
      .select({ category_id: categoriesTable.category_id })
      .from(categoriesTable)
      .where(inArray(categoriesTable.category_name, expertise_category_names));

    const expertiseCategoryIds = matchingCategories.map((c) => c.category_id);

    const [app] = await db
      .insert(expertApplicationsTable)
      .values({
        user_id,
        full_name,
        github_link,
        about_self,
        reason,
        additional_info,
      })
      .returning({ application_id: expertApplicationsTable.application_id });

    const applicationId = app.application_id;

    const categoryInserts: InsertExpertApplicationCategory[] = expertiseCategoryIds.map(
      (id: number) => ({
        application_id: applicationId,
        category_id: id,
      })
    );
    await db.insert(expertApplicationCategoriesTable).values(categoryInserts);

    const certInserts: InsertExpertApplicationCertificate[] = certificate_urls.map(
      (url: string, index: number) => ({
        application_id: applicationId,
        file_url: url,
        description: certificate_descriptions[index],
      })
    );
    await db.insert(expertApplicationCertificatesTable).values(certInserts);

    return NextResponse.json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error processing expert application:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
