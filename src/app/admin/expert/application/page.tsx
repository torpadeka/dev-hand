// /app/admin/expert-applications/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { dummyApplications } from "./dummy";

export default function ExpertApplicationsPage() {
  const router = useRouter();

  const handleViewMore = (id: number) => {
    router.push(`/admin/expert/application/${id}`);
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Expert Applications</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border rounded-lg">
          <thead className="bg-secondary text-secondary-foreground">
            <tr>
              <th className="px-4 py-2 border border-border">Applicant Name</th>
              <th className="px-4 py-2 border border-border">GitHub Link</th>
              <th className="px-4 py-2 border border-border">Status</th>
              <th className="px-4 py-2 border border-border">Applied At</th>
              <th className="px-4 py-2 border border-border">Action</th>
            </tr>
          </thead>
          <tbody>
            {dummyApplications.map((app: any) => (
              <tr key={app.id} className="bg-primary text-primary-foreground">
                <td className="px-4 py-2 border border-border">{app.name}</td>
                <td className="px-4 py-2 border border-border">
                  <a
                    href={app.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-button hover:underline"
                  >
                    {app.github}
                  </a>
                </td>
                <td className="px-4 py-2 border border-border">{app.status}</td>
                <td className="px-4 py-2 border border-border">
                  {new Date(app.applied_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border border-border">
                  <button
                    onClick={() => handleViewMore(app.id)}
                    className="px-3 py-1 bg-button text-button-foreground rounded-md hover:bg-popover"
                  >
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
