import { useEffect, useState } from "react";

export default function TruthMeter({ truthScore, lieProbability, verdict, verdictEmoji }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    setAnimated(0);
    const timer = setTimeout(() => setAnimated(truthScore), 100);
    return () => clearTimeout(timer);
  }, [truthScore]);

  const getColor = (score) => {
    if (score >= 75) return "#4ade80";
    if (score >= 55) return "#facc15";
    if (score >= 35) return "#fb923c";
    return "#f87171";
  };

  const color = getColor(truthScore);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (animated / 100) * circumference;

  return (
    <div className="truth-meter-container">
      <div className="meter-ring-wrapper">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {/* Background ring */}
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          {/* Animated progress ring */}
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeDashoffset={0}
            transform="rotate(-90 80 80)"
            style={{
              transition: "stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              filter: `drop-shadow(0 0 8px ${color}80)`
            }}
          />
        </svg>

        {/* Center text */}
        <div className="meter-center">
          <div className="meter-score" style={{ color }}>
            {Math.round(animated)}%
          </div>
          <div className="meter-label">Truth Score</div>
        </div>
      </div>

      {/* Verdict badge */}
      <div className="verdict-badge" style={{ borderColor: `${color}40`, color }}>
        <span className="verdict-emoji">{verdictEmoji}</span>
        <span className="verdict-text">{verdict}</span>
      </div>

      {/* Dual scores */}
      <div className="dual-scores">
        <div className="score-item">
          <div className="score-value" style={{ color: "#4ade80" }}>{truthScore}%</div>
          <div className="score-desc">Truthful</div>
        </div>
        <div className="score-divider" />
        <div className="score-item">
          <div className="score-value" style={{ color: "#f87171" }}>{lieProbability}%</div>
          <div className="score-desc">Deceptive</div>
        </div>
      </div>
    </div>
  );
}