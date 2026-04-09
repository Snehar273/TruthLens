import { useEffect, useState } from "react";
import { analyzeWithRules } from "../utils/ruleEngine";
import { calculateScore } from "../utils/scoringEngine";

export default function ConfidenceTimeline({ text }) {
  const [points, setPoints] = useState([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if (!text) return;

    // Split into sentences
    const sentences = text
      .split(/(?<=[.!?])\s+|(?<=[.!?])$/)
      .map(s => s.trim())
      .filter(s => s.length > 2);

    if (sentences.length < 2) {
      // If only 1 sentence, split by comma-chunks
      const chunks = text.split(/,\s+/).filter(c => c.length > 3);
      if (chunks.length >= 2) {
        const computed = chunks.map((chunk, i) => {
          const { penalty } = analyzeWithRules(chunk);
          const score = calculateScore(chunk, penalty);
          return { label: `Part ${i + 1}`, text: chunk, score: score.truthScore };
        });
        setPoints(computed);
        return;
      }
      // fallback: sliding window
      const words = text.split(" ");
      const windowSize = Math.max(3, Math.floor(words.length / 4));
      const windows = [];
      for (let i = 0; i < words.length; i += windowSize) {
        const chunk = words.slice(i, i + windowSize).join(" ");
        if (chunk.trim()) windows.push(chunk);
      }
      const computed = windows.map((chunk, i) => {
        const { penalty } = analyzeWithRules(chunk);
        const score = calculateScore(chunk, penalty);
        return { label: `Segment ${i + 1}`, text: chunk, score: score.truthScore };
      });
      setPoints(computed);
      return;
    }

    const computed = sentences.map((s, i) => {
      const { penalty } = analyzeWithRules(s);
      const score = calculateScore(s, penalty);
      return { label: `S${i + 1}`, text: s, score: score.truthScore };
    });
    setPoints(computed);
  }, [text]);

  if (points.length < 2) return null;

  const getColor = (s) => s >= 75 ? "#4ade80" : s >= 55 ? "#facc15" : s >= 35 ? "#fb923c" : "#f87171";

  // SVG chart
  const W = 500, H = 120, PAD = { top: 16, bottom: 28, left: 32, right: 16 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const xStep = chartW / Math.max(points.length - 1, 1);
  const toX = (i) => PAD.left + i * xStep;
  const toY = (score) => PAD.top + chartH - (score / 100) * chartH;

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(p.score)}`).join(" ");
  const areaD = `${pathD} L ${toX(points.length - 1)} ${H - PAD.bottom} L ${toX(0)} ${H - PAD.bottom} Z`;

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <span className="timeline-title">Confidence Timeline</span>
        <span className="timeline-sub">Truth score across each sentence/segment</span>
      </div>

      <div className="timeline-chart-wrapper">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[25, 50, 75].map(y => (
            <g key={y}>
              <line
                x1={PAD.left} y1={toY(y)}
                x2={W - PAD.right} y2={toY(y)}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1"
              />
              <text x={PAD.left - 4} y={toY(y) + 4} fill="#454a58" fontSize="8" textAnchor="end" fontFamily="monospace">{y}</text>
            </g>
          ))}

          {/* Area fill */}
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.01"/>
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#areaGrad)" />

          {/* Line */}
          <path d={pathD} fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={toX(i)} cy={toY(p.score)} r={hovered === i ? 7 : 5}
                fill={getColor(p.score)}
                stroke="var(--bg)"
                strokeWidth="2"
                style={{ cursor: "pointer", transition: "r 0.15s" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
              <text
                x={toX(i)} y={H - PAD.bottom + 14}
                fill="#454a58" fontSize="9" textAnchor="middle" fontFamily="monospace"
              >
                {p.label}
              </text>
            </g>
          ))}

          {/* Tooltip */}
          {hovered !== null && (
            <g>
              <rect
                x={Math.min(toX(hovered) - 50, W - 116)} y={toY(points[hovered].score) - 36}
                width={110} height={28} rx={5}
                fill="rgba(13,17,21,0.95)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
              />
              <text
                x={Math.min(toX(hovered), W - 61) + 5} y={toY(points[hovered].score) - 22}
                fill={getColor(points[hovered].score)} fontSize="10" fontFamily="monospace" fontWeight="bold"
              >
                {points[hovered].score}% Truth
              </text>
              <text
                x={Math.min(toX(hovered), W - 61) + 5} y={toY(points[hovered].score) - 11}
                fill="#8b909e" fontSize="8" fontFamily="monospace"
              >
                {points[hovered].text.slice(0, 18)}{points[hovered].text.length > 18 ? "…" : ""}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Sentence breakdown */}
      <div className="timeline-sentences">
        {points.map((p, i) => (
          <div
            key={i}
            className={`timeline-sentence-item ${hovered === i ? "hovered" : ""}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="timeline-sent-label" style={{ color: getColor(p.score) }}>
              {p.label} · {p.score}%
            </span>
            <span className="timeline-sent-text">{p.text.slice(0, 60)}{p.text.length > 60 ? "…" : ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
