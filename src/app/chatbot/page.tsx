"use client";

import React, { useState } from "react";

export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAzureOpenAI(question: any) {
    const response = await fetch(
      "https://aiblecvmaker.openai.azure.com/openai/deployments/aiblecvmaker/chat/completions?api-version=2024-05-01-preview",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": "ba834e6a110d48309a37c4dc93d3b93d",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a chatbot that I want to place on a forum-like website, so you need to answer questions related to programming.",
            },
            {
              role: "user",
              content:
                "Answer simply, effectively, and politely. Stay on topic.",
            },
            { role: "user", content: question },
          ],
        }),
      }
    );

    const data = await response.json();
    return data.choices[0].message.content;
  }

  const handleAsk = () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    const answer = askAzureOpenAI(question)
      .then((answer) => setAnswer(answer))
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          AI QnA
        </h1>

        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-black"
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
