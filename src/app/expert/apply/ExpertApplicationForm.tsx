"use client";

import ApplyCategorySelector from "@/components/ApplyCategorySelector";
import CategorySelector from "@/components/CategorySelector";
import CertificateUploader from "@/components/CertificateUploader";
import React, { useState, useRef, FormEvent } from "react";
import { put } from "@vercel/blob";

interface ExpertApplicationFormProps {
  categoryMap: Map<number, string>;
  userID: number;
}

export default function ExpertApplicationForm({
  categoryMap,
  userID,
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
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [error, setError] = useState("");
  const categorySelectorRef = useRef<{
    getSelectedCategories: () => void;
  } | null>(null);

  const validateForm = (): string | null => {
    if (!name.trim()) return "Full name is required.";
    if (!github.trim()) return "GitHub link is required.";
    if (!github.startsWith("http")) return "GitHub link must be a valid URL.";
    if (certificates.length === 0)
      return "Please upload at least one certificate.";
    if (certificates.some((c) => !c.description.trim()))
      return "Each certificate must have a description.";
    if (selectedCategories.length === 0)
      return "Select at least one expertise category.";
    if (!aboutYourself.trim()) return "Tell us about yourself.";
    if (!reason.trim()) return "Please share your reason for applying.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("SELECTED", selectedCategories);
    try {
      const uploadedCertificates: { file_url: string; description: string }[] =
        [];

      for (const cert of certificates) {
        const formData = new FormData();
        formData.append("file", cert.file);
        formData.append("filename", cert.file.name);

        const res = await fetch("/api/upload-blob", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const { url } = await res.json();

        uploadedCertificates.push({
          file_url: url,
          description: cert.description,
        });
      }

      const payload = {
        user_id: userID,
        full_name: name,
        github_link: github,
        about_self: aboutYourself,
        reason,
        additional_info: additionalInfo,
        expertise_category_names: selectedCategories,
        certificate_urls: uploadedCertificates.map((c) => c.file_url),
        certificate_descriptions: uploadedCertificates.map(
          (c) => c.description
        ),
      };

      const res = await fetch("/api/expert/apply-expert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("There was an error submitting your application.");
    }
  };

  const handleSave = () => {
    if (categorySelectorRef.current) {
      categorySelectorRef.current.getSelectedCategories();
    }
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSaved(false);
    } else {
      setError("");
      setIsSaved(true);
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
      {error && (
        <p className="text-red-500 text-xl mb-4 font-medium mt-2 text-center">
          {error}
        </p>
      )}

      <button
        type="button"
        className="w-full py-2 px-4 mb-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        onClick={handleSave}
      >
        Save Application
      </button>
      <button
        type="submit"
        className={`w-full py-2 px-4 font-semibold rounded-md 
                  ${
                    isSaved
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
        disabled={!isSaved}
      >
        Submit Application
      </button>
    </form>
  );
}
