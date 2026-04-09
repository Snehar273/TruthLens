import { useState } from "react";
import { analyzeWithRules } from "../utils/ruleEngine";
import { calculateScore } from "../utils/scoringEngine";
import { getGroqInsight } from "../utils/groqService";

function MiniMeter({ score }) {
  const getColor = (s) => s >= 75 ? "#4ade80" : s >= 55 ? "#facc15" : s >= 35 ? "#fb923c" : "#f87171";
  const color = getColor(score);
  const pct = score;
  return (
    <div className="mini-meter">
      <div className="mini-meter-bar-track">
        <div className="mini-meter-bar-fill" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}60` }} />
      </div>
      <div className="mini-meter-labels">
        <span style={{ color, fontFamily: "var(--font-mono)", fontSize: "1.1rem", fontWeight: 700 }}>{score}%</span>
        <span style={{ color: "var(--text-3)", fontSize: "0.65rem", fontFamily: "var(--font-mono)" }}>Truth Score</span>
      </div>
    </div>
  );
}

export default function ComparisonMode({ onClose }) {
  const [texts, setTexts] = useState(["", ""]);
  const [results, setResults] = useState([null, null]);
  const [loading, setLoading] = useState([false, false]);
  const [winner, setWinner] = useState(null);

  const analyze = async (idx) => {
    if (!texts[idx].trim()) return;
    const newLoading = [...loading];
    newLoading[idx] = true;
    setLoading(newLoading);

    const { flags, penalty, highlights } = analyzeWithRules(texts[idx]);
    const scores = calculateScore(texts[idx], penalty);
    const aiInsight = await getGroqInsight(texts[idx], flags, scores);

    const newResults = [...results];
    newResults[idx] = { scores, flags, highlights, aiInsight };
    setResults(newResults);

    // determine winner if both done
    const other = newResults[idx === 0 ? 1 : 0];
    if (other) {
      const w = newResults[0].scores.truthScore >= newResults[1].scores.truthScore ? 0 : 1;
      setWinner(w);
    }

    newLoading[idx] = false;
    setLoading([...newLoading]);
  };

  const getColor = (s) => s >= 75 ? "#4ade80" : s >= 55 ? "#facc15" : s >= 35 ? "#fb923c" : "#f87171";
  const labels = ["Statement A", "Statement B"];

  return (
    <div className="comparison-overlay">
      <div className="comparison-modal">
        <div className="comparison-header">
          <div className="comparison-title">
            <span className="comp-icon">⊕</span>
            Comparison Mode
          </div>
          <button className="comp-close" onClick={onClose}>✕</button>
        </div>

        <p className="comparison-desc">Analyze two statements side by side to compare their truthfulness signals.</p>

        {/* Winner banner */}
        {winner !== null && results[0] && results[1] && (
          <div className="winner-banner" style={{ borderColor: `${getColor(results[winner].scores.truthScore)}40`, background: `${getColor(results[winner].scores.truthScore)}08` }}>
            <span style={{ color: getColor(results[winner].scores.truthScore) }}>
              ✦ {labels[winner]} is more truthful ({results[winner].scores.truthScore}% vs {results[winner === 0 ? 1 : 0].scores.truthScore}%)
            </span>
          </div>
        )}

        <div className="comparison-grid">
          {[0, 1].map(idx => (
            <div key={idx} className={`comp-panel ${winner === idx ? "comp-winner" : winner !== null ? "comp-loser" : ""}`}>
              <div className="comp-panel-label">{labels[idx]}</div>
              <textarea
                className="comp-textarea"
                placeholder={`Enter ${labels[idx].toLowerCase()}…`}
                value={texts[idx]}
                onChange={e => { const t = [...texts]; t[idx] = e.target.value; setTexts(t); }}
              />
              <button
                className={`comp-analyze-btn ${texts[idx].trim() && !loading[idx] ? "active" : "disabled"}`}
                onClick={() => analyze(idx)}
                disabled={!texts[idx].trim() || loading[idx]}
              >
                {loading[idx] ? "Analyzing…" : "Analyze →"}
              </button>

              {results[idx] && (
                <div className="comp-result">
                  <MiniMeter score={results[idx].scores.truthScore} />
                  <div className="comp-verdict" style={{ color: getColor(results[idx].scores.truthScore) }}>
                    {results[idx].scores.verdict}
                  </div>
                  <div className="comp-flags">
                    {results[idx].flags.length === 0
                      ? <span className="comp-clean">✦ No deception signals</span>
                      : results[idx].flags.map((f, i) => (
                          <div key={i} className="comp-flag-chip">{f.label}</div>
                        ))
                    }
                  </div>
                  <div className="comp-ai">{results[idx].aiInsight}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
