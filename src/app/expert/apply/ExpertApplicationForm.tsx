"use client";

import ApplyCategorySelector from "@/components/ApplyCategorySelector";
import CategorySelector from "@/components/CategorySelector";
import CertificateUploader from "@/components/CertificateUploader";
import React, { useState, useRef, FormEvent } from "react";

interface ExpertApplicationFormProps {
  categoryMap: Map<number, string>;
}

export default function ExpertApplicationForm({
  categoryMap,
}: ExpertApplicationFormProps) {
  const categories = Array.from(categoryMap, ([id, name]) => ({ id, name }));

  const [name, setName] = useState("");
  const [github, setGithub] = useState("");
  const [certificates, setCertificates] = useState<
    { file: File; description: string }[]
  >([]);
  const [aboutYourself, setAboutYourself] = useState("");
  const [reason, setReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const categorySelectorRef = useRef<{
    getSelectedCategories: () => void;
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (categorySelectorRef.current) {
      categorySelectorRef.current.getSelectedCategories();
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("github", github);
    certificates.forEach(({ file, description }, index) => {
      formData.append(`certificates[${index}]`, file);
      formData.append(`certDescriptions[${index}]`, description);
    });
    formData.append("expertiseCategory", JSON.stringify(selectedCategories));
    formData.append("aboutYourself", aboutYourself);
    formData.append("reason", reason);
    formData.append("additionalInfo", additionalInfo);

    try {
      const res = await fetch("/api/apply-expert", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Submission failed");
      alert("Application submitted successfully!");
      setName("");
      setGithub("");
      setCertificates([]);
      setSelectedCategories([]);
      setAboutYourself("");
      setReason("");
      setAdditionalInfo("");
    } catch (error: any) {
      console.error("Error submitting application:", error);
      alert("There was an error submitting your application.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto p-6 bg-primary rounded-lg shadow-md"
    >
      <div className="flex w-full gap-4">
        <div className="w-1/2">
          <div className="mb-4">
            <label className="block text-lg font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border bg-primary rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium">GitHub Link</label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              required
              className="w-full p-2 border bg-primary rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium">
              Select your expertise
            </label>
            <CertificateUploader onCertificatesChange={setCertificates} />
          </div>

          <div className="mb-4">
            <ApplyCategorySelector
              ref={categorySelectorRef}
              onSubmit={setSelectedCategories}
              categories={categoryMap}
            />
          </div>
        </div>
        <div className="w-1/2">
          <div className="mb-4">
            <label className="block text-lg font-medium">
              Tell me about yourself
            </label>
            <textarea
              value={aboutYourself}
              onChange={(e) => setAboutYourself(e.target.value)}
              required
              className="w-full p-2 border bg-primary rounded-md"
              rows={4}
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium">
              Why do you want to be an expert?
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full p-2 border bg-primary rounded-md"
              rows={4}
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium">
              Additional Information
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full p-2 border bg-primary rounded-md"
              rows={3}
            ></textarea>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
      >
        Submit Application
      </button>
    </form>
  );
}
