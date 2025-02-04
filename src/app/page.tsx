import { db } from "@/db";
import * as schema from "@/schema";

export default async function Home() {
    const result = await db.select().from(schema.usersTable);
    return <>{result.map((data) => 
        <>{data.id}</>
    )}</>;
}
