"use client";

import React, { useState } from "react";
import { askAzureOpenAI } from "./function";

export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = () => {
    if (!question.trim()) return; // Prevent empty questions

    setLoading(true);
    setAnswer("Thinking..."); // Indicate loading state

    askAzureOpenAI(question)
      .then((answer) => setAnswer(answer))
      .catch(() => setAnswer("Error: Unable to get response."))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          AI QnA
        </h1>

        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-white"
          placeholder="Ask me anything..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
        />

        <button
          onClick={handleAsk}
          className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        {answer && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-gray-800">
            <strong>Answer:</strong> {answer}
          </div>
        )}
      </div>
    </div>
  );
}
