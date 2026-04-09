const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function getGroqInsight(text, flags, scores) {
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  if (!API_KEY || API_KEY === "your_actual_groq_api_key_here") {
    return "⚠ Add your Groq API key to the .env file as VITE_GROQ_API_KEY to enable AI insights.";
  }

  const flagSummary = flags.length > 0
    ? flags.map(f => `- ${f.label}: ${f.detail}`).join("\n")
    : "No specific deception flags detected";

  const content = `Analyze this statement for deception: "${text}". Truth Score: ${scores.truthScore}%. Sentiment: ${scores.sentimentLabel}. Flags: ${flagSummary}. Give a 2-3 sentence behavioral insight.`;

  const requestBody = {
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: content
      }
    ],
    max_tokens: 150,
    temperature: 0.7
  };

  // Log request for debugging
  console.log("=== GROQ REQUEST ===");
  console.log("URL:", GROQ_API_URL);
  console.log("Key starts with:", API_KEY.substring(0, 8) + "...");
  console.log("Body:", JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("=== GROQ RESPONSE ===");
    console.log("Status:", response.status);

    const rawText = await response.text();
    console.log("Raw response:", rawText);

    if (!response.ok) {
      let errorData = {};
      try { errorData = JSON.parse(rawText); } catch {}
      console.error("Error details:", errorData);

      // Show the actual error message from Groq
      const groqMsg = errorData?.error?.message || rawText || "Unknown error";
      return `❌ Groq says: "${groqMsg}"`;
    }

    const data = JSON.parse(rawText);
    return data.choices?.[0]?.message?.content?.trim() || "No insight generated.";

  } catch (error) {
    console.error("Fetch error:", error);
    return `Network error: ${error.message}`;
  }
}