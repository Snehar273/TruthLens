const SUSPICIOUS_WORDS = new Set([
  "trust", "honestly", "swear", "believe", "promise", "truthfully",
  "lying", "never", "guarantee", "absolutely", "definitely", "100%",
  "seriously", "really", "actually", "literally", "obviously", "clearly"
]);

const DEFLECTION_WORDS = new Set([
  "ridiculous", "accusing", "everyone", "anyone", "dare", "impossible"
]);

const VAGUE_WORDS = new Set([
  "maybe", "kind", "sort", "think", "guess", "probably", "possibly",
  "remember", "recall", "sure", "perhaps"
]);

const POSITIVE_WORDS = new Set([
  "yes", "correct", "right", "true", "fact", "certain", "confirmed",
  "agreed", "exactly", "precisely", "absolutely"
]);

function getWordScore(word) {
  const lower = word.toLowerCase().replace(/[^a-z]/g, "");
  if (SUSPICIOUS_WORDS.has(lower)) return { type: "suspicious", color: "#f87171", bg: "rgba(248,113,113,0.18)", label: "Persuasive" };
  if (DEFLECTION_WORDS.has(lower)) return { type: "deflection", color: "#fb923c", bg: "rgba(251,146,60,0.18)", label: "Deflection" };
  if (VAGUE_WORDS.has(lower)) return { type: "vague", color: "#facc15", bg: "rgba(250,204,21,0.15)", label: "Vague" };
  if (POSITIVE_WORDS.has(lower)) return { type: "positive", color: "#4ade80", bg: "rgba(74,222,128,0.13)", label: "Credible" };
  return { type: "neutral", color: "var(--text-2)", bg: "transparent", label: null };
}

export default function DeceptionHeatmap({ text }) {
  if (!text) return null;

  const words = text.split(/(\s+)/);
  const legend = [
    { color: "#f87171", label: "Persuasive" },
    { color: "#fb923c", label: "Deflection" },
    { color: "#facc15", label: "Vague" },
    { color: "#4ade80", label: "Credible" },
    { color: "var(--text-2)", label: "Neutral" },
  ];

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <span className="heatmap-title">Deception Heatmap</span>
        <div className="heatmap-legend">
          {legend.map(l => (
            <div key={l.label} className="legend-item">
              <span className="legend-dot" style={{ background: l.color }} />
              <span className="legend-label">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="heatmap-text">
        {words.map((word, i) => {
          if (/^\s+$/.test(word)) return <span key={i}>{word}</span>;
          const score = getWordScore(word);
          return (
            <span
              key={i}
              className="heatmap-word"
              style={{
                color: score.color,
                background: score.bg,
                borderRadius: score.type !== "neutral" ? "4px" : "0",
                padding: score.type !== "neutral" ? "1px 3px" : "0",
                position: "relative",
                cursor: score.label ? "default" : "text",
              }}
              title={score.label ? `${score.label} word` : undefined}
            >
              {word}
            </span>
          );
        })}
      </div>

      <div className="heatmap-footer">
        Hover over colored words to see their signal type
      </div>
    </div>
  );
}
