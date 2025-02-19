"use client";

import React, { useState } from "react";

interface Certificate {
  file: File | null;
  description: string;
}

interface CertificateUploaderProps {
  onCertificatesChange: (
    certificates: { file: File; description: string }[]
  ) => void;
}

export default function CertificateUploader({
  onCertificatesChange,
}: CertificateUploaderProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([
    { file: null, description: "" },
  ]);

  const handleFileChange = (index: number, file: File | null) => {
    const newCertificates = [...certificates];
    newCertificates[index].file = file;
    setCertificates(newCertificates);
    onCertificatesChange(
      newCertificates.filter((cert) => cert.file !== null) as {
        file: File;
        description: string;
      }[]
    );
  };

  const handleDescriptionChange = (index: number, description: string) => {
    const newCertificates = [...certificates];
    newCertificates[index].description = description;
    setCertificates(newCertificates);
    onCertificatesChange(
      newCertificates.filter((cert) => cert.file !== null) as {
        file: File;
        description: string;
      }[]
    );
  };

  const addCertificateField = () => {
    if (certificates.length >= 5) return;
    setCertificates([...certificates, { file: null, description: "" }]);
  };

  const removeCertificateField = (index: number) => {
    const newCertificates = certificates.filter((_, i) => i !== index);
    setCertificates(newCertificates);
    onCertificatesChange(
      newCertificates.filter((cert) => cert.file !== null) as {
        file: File;
        description: string;
      }[]
    );
  };

  return (
    <div className="">
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full rounded-lg">
          <thead className="bg-background text-foreground">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">
                Certificate
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                Description
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="">
            {certificates.map((cert, index) => (
              <tr key={index} className="bg-background text-primary-foreground">
                <td className="px-4 py-2">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) =>
                      handleFileChange(
                        index,
                        e.target.files ? e.target.files[0] : null
                      )
                    }
                    className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-popover file:text-popover-foreground dark:file:bg-gray-700 dark:file:text-gray-300"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Describe your certificate..."
                    value={cert.description}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                    className="w-full px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-popover-foreground"
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeCertificateField(index)}
                      className="text-destructive hover:text-destructive-foreground text-sm"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="">
        {certificates.length < 5 && (
          <button
            type="button"
            onClick={addCertificateField}
            className="mt-3 px-4 py-2 bg-chart-3 text-button-foreground font-semibold rounded-md hover:bg-chart-3/80"
          >
            + Add Another Certificate
          </button>
        )}
      </div>
    </div>
  );
}
