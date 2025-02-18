"use client";

import CategorySelector from "@/components/CategorySelector";
import Navbar from "@/components/Navbar";
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
  const [certificates, setCertificates] = useState<File[]>([]);
  const [aboutYourself, setAboutYourself] = useState("");
  const [reason, setReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const categorySelectorRef = useRef<{
    getSelectedCategories: () => void;
  } | null>(null);

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCertificates(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (categorySelectorRef.current) {
      categorySelectorRef.current.getSelectedCategories();
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("github", github);
    certificates.forEach((file) => formData.append("certificates", file));
    formData.append("expertiseCategory", JSON.stringify(selectedCategories)); // Pass selected categories as JSON
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
      className="max-w-xl mx-auto p-6 bg-primary rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">GitHub Link</label>
        <input
          type="url"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          required
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Certificates</label>
        {certificates.map((certificate, index) => (
          <div className="" key={index}>
            {certificate.name}
          </div>
        ))}
        <input
          type="file"
          onChange={handleCertificateChange}
          multiple
          className="w-full text-sm p-2 border rounded-md"
        />
      </div>

      <div className="mb-4">
        SELECT YOUR EXPERTISE
        <CategorySelector
          ref={categorySelectorRef}
          onSubmit={setSelectedCategories}
          categories={categoryMap}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">
          Tell me about yourself
        </label>
        <textarea
          value={aboutYourself}
          onChange={(e) => setAboutYourself(e.target.value)}
          required
          className="w-full p-2 border rounded-md"
          rows={4}
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">
          Why do you want to be an expert?
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="w-full p-2 border rounded-md"
          rows={4}
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">
          Additional Information
        </label>
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={3}
        ></textarea>
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
