import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
    expertApplicationsTable,
    expertApplicationCertificatesTable,
    expertApplicationCategoriesTable,
    categoriesTable,
} from "@/schema";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export async function GET(
    request: Request,
    { params }: { params: Promise<{ applicationId: string }> }
) {
    const parameters = await params;
    const applicationId = parseInt(parameters.applicationId);

    try {
        // Fetch application main details
        const [application] = await db
            .select({
                application_id: expertApplicationsTable.application_id,
                full_name: expertApplicationsTable.full_name,
                github_link: expertApplicationsTable.github_link,
                about_self: expertApplicationsTable.about_self,
                reason: expertApplicationsTable.reason,
                additional_info: expertApplicationsTable.additional_info,
                status: expertApplicationsTable.status,
                created_at: expertApplicationsTable.created_at,
            })
            .from(expertApplicationsTable)
            .where(eq(expertApplicationsTable.application_id, applicationId));

        if (!application) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            );
        }

        const certificates = await db
            .select({
                certificate_id:
                    expertApplicationCertificatesTable.certificate_id,
                file_url: expertApplicationCertificatesTable.file_url,
                description: expertApplicationCertificatesTable.description,
            })
            .from(expertApplicationCertificatesTable)
            .where(
                eq(
                    expertApplicationCertificatesTable.application_id,
                    applicationId
                )
            );

        const categories = await db
            .select({
                category_name: categoriesTable.category_name,
            })
            .from(expertApplicationCategoriesTable)
            .innerJoin(
                categoriesTable,
                eq(
                    expertApplicationCategoriesTable.category_id,
                    categoriesTable.category_id
                )
            )
            .where(
                eq(
                    expertApplicationCategoriesTable.application_id,
                    applicationId
                )
            );

        return NextResponse.json({
            application: {
                ...application,
                certificates,
                categories: categories.map((c) => c.category_name),
            },
        });
    } catch (error) {
        console.error("Error fetching application detail:", error);
        return NextResponse.json(
            { error: "Failed to fetch application detail" },
            { status: 500 }
        );
    }
}
