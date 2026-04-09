import { useState } from "react";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export default function RoastMode({ text, scores, flags, onClose }) {
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateRoast = async () => {
    const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
    setLoading(true);

    const flagList = flags.map(f => f.label).join(", ") || "none";
    const honesty = scores.truthScore >= 70 ? "surprisingly honest" : scores.truthScore >= 50 ? "sus" : "absolutely cooked";

    const prompt = `You are a savage but funny AI roast master. Someone said: "${text}"

Their truth score is ${scores.truthScore}% (${honesty}). Detected signals: ${flagList}.

Roast them in 2-3 sentences. Be witty, savage, and funny — like a Gen Z comedian. Use casual language. If they seem honest, give a surprised compliment roast. If they're lying, absolutely destroy them (but keep it fun, not mean). Don't hold back!`;

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 120,
          temperature: 0.95
        }),
      });

      const data = await response.json();
      const text2 = data.choices?.[0]?.message?.content?.trim();
      setRoast(text2 || "Even my roast generator can't handle this level of cap 💀");
      setGenerated(true);
    } catch {
      setRoast("Bro the AI is speechless. That's how bad this statement is 💀");
      setGenerated(true);
    }

    setLoading(false);
  };

  const getRoastEmoji = () => {
    if (scores.truthScore >= 70) return "😇";
    if (scores.truthScore >= 50) return "🤨";
    return "💀";
  };

  return (
    <div className="roast-overlay">
      <div className="roast-modal">
        <div className="roast-header">
          <div className="roast-title">
            <span>🔥</span> Roast Mode
            <span className="roast-badge">FUN</span>
          </div>
          <button className="comp-close" onClick={onClose}>✕</button>
        </div>

        <div className="roast-statement">
          <span className="roast-quote">"</span>
          {text}
          <span className="roast-quote">"</span>
        </div>

        <div className="roast-score-display">
          <span style={{
            fontSize: "2.5rem",
            fontFamily: "var(--font-mono)",
            fontWeight: 800,
            color: scores.truthScore >= 70 ? "#4ade80" : scores.truthScore >= 50 ? "#facc15" : "#f87171"
          }}>
            {getRoastEmoji()} {scores.truthScore}%
          </span>
          <span style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
            Truth Score
          </span>
        </div>

        {!generated ? (
          <button
            className={`roast-generate-btn ${!loading ? "active" : ""}`}
            onClick={generateRoast}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading">
                <span className="dot-pulse" />
                Cooking up a roast…
              </span>
            ) : "🔥 Generate Roast"}
          </button>
        ) : (
          <div className="roast-result">
            <div className="roast-text">{roast}</div>
            <button className="roast-again-btn" onClick={() => { setGenerated(false); setRoast(""); }}>
              Try another roast →
            </button>
          </div>
        )}

        <div className="roast-disclaimer">
          😂 This is just for fun! Don't take it personally.
        </div>
      </div>
    </div>
  );
}
