"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { dummyApplicationDetails } from "../dummy";

interface Certificate {
  certificate_id: number;
  file_url: string;
  description: string;
}

interface ApplicationDetail {
  application_id: number;
  name: string;
  github: string;
  category_name: string;
  about: string;
  motivation: string;
  applied_at: string;
  certificates: Certificate[];
}

export default function ApplicationDetailPage() {
  const { applicationId } = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationDetail | any>(null);
  const [status, setStatus] = useState<string>("Pending");

  // Fetch application details
  useEffect(() => {
    const appId = Number(applicationId);
    if (dummyApplicationDetails[appId]) {
      const appDetail = dummyApplicationDetails[appId];
      setApplication(appDetail);
    }
  }, [applicationId]);

  // Approve Action
  const handleApprove = () => {
    if (confirm("Are you sure you want to approve this application?")) {
      setStatus("Approved");
      console.log(`✅ Application ${application?.application_id} approved.`);
      // Here, you can add an API call to update the status
    }
  };

  // Reject Action
  const handleReject = () => {
    if (confirm("Are you sure you want to reject this application?")) {
      setStatus("Rejected");
      console.log(`❌ Application ${application?.application_id} rejected.`);
      // Here, you can add an API call to update the status
    }
  };

  if (!application) {
    return <div className="text-center">Loading application details...</div>;
  }

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Application Details</h1>

      <div className="bg-primary p-4 rounded-lg text-primary-foreground">
        <p>
          <strong>Name:</strong> {application.name}
        </p>
        <p>
          <strong>GitHub:</strong>{" "}
          <a
            href={application.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-button hover:underline"
          >
            {application.github}
          </a>
        </p>
        <p>
          <strong>Category:</strong> {application.category_name}
        </p>
        <p>
          <strong>About:</strong> {application.about}
        </p>
        <p>
          <strong>Motivation:</strong> {application.motivation}
        </p>
        <p>
          <strong>Applied At:</strong>{" "}
          {new Date(application.applied_at).toLocaleString()}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`font-semibold ${
              status === "Approved"
                ? "text-green-500"
                : status === "Rejected"
                ? "text-red-500"
                : "text-yellow-500"
            }`}
          >
            {status}
          </span>
        </p>

        <h2 className="text-xl font-semibold mt-4">Certificates</h2>
        {application.certificates.length > 0 ? (
          <ul>
            {application.certificates.map((cert: Certificate) => (
              <li key={cert.certificate_id} className="mt-2">
                <a
                  href={cert.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-popover-foreground underline"
                >
                  {cert.description}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No certificates uploaded.</p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Approve
          </button>

          <button
            onClick={handleReject}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Reject
          </button>

          <button
            onClick={() => router.push("/admin/expert/application")}
            className="px-4 py-2 bg-button text-button-foreground rounded-md hover:bg-popover"
          >
            Back to Applications
          </button>
        </div>
      </div>
    </div>
  );
}
