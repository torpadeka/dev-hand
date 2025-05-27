export async function askAzureOpenAI(question: string): Promise<string> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.NEXT_PUBLIC_AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2025-01-01-preview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY || "",
          },
          body: JSON.stringify({
            messages: [
                {
                  role: "system",
                  content: `
              You are a helpful and knowledgeable programming assistant chatbot for a developer forum website. 
              Your job is to answer coding-related questions clearly and concisely using valid HTML for formatting.
              
              Always use:
              - <p> tags for paragraphs
              - <br> tags for line breaks
              - <code> or <pre> for code blocks
              - <ul>/<li> for lists if needed
              Avoid using markdown — only return pure HTML.
              `.trim(),
                },
                {
                  role: "user",
                  content: `
              Answer simply, effectively, and politely. Stay focused on programming. 
              Respond using clean HTML only.
              `.trim(),
                },
                {
                  role: "user",
                  content: question,
                },
              ],              
            temperature: 0.7,
            top_p: 0.95,
            frequency_penalty: 0,
            presence_penalty: 0,
          }),
        }
      );
  
      const data = await response.json();
      console.log("Azure OpenAI response:", data);
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        return "No response from AI.";
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Error fetching AI response.";
    }
  }
  