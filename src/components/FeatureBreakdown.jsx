import { useEffect, useState } from "react";

const colorMap = {
  red: { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", text: "#f87171", bar: "#f87171" },
  orange: { bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.25)", text: "#fb923c", bar: "#fb923c" },
  yellow: { bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.25)", text: "#facc15", bar: "#facc15" },
  green: { bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.25)", text: "#4ade80", bar: "#4ade80" },
};

function FlagBar({ flag, index }) {
  const [width, setWidth] = useState(0);
  const colors = colorMap[flag.color] || colorMap.yellow;
  const maxPenalty = 36;
  const pct = Math.min((flag.penalty / maxPenalty) * 100, 100);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 150 + index * 100);
    return () => clearTimeout(t);
  }, [pct, index]);

  return (
    <div className="flag-item" style={{ background: colors.bg, borderColor: colors.border }}>
      <div className="flag-header">
        <div className="flag-label" style={{ color: colors.text }}>
          <span className="flag-dot" style={{ background: colors.bar }} />
          {flag.label}
        </div>
        <div className="flag-penalty" style={{ color: colors.text }}>-{flag.penalty}pts</div>
      </div>
      <div className="flag-detail">{flag.detail}</div>
      <div className="flag-bar-track">
        <div
          className="flag-bar-fill"
          style={{
            width: `${width}%`,
            background: colors.bar,
            boxShadow: `0 0 6px ${colors.bar}60`,
            transition: `width 0.8s cubic-bezier(0.4,0,0.2,1) ${index * 0.1}s`
          }}
        />
      </div>
    </div>
  );
}

export default function FeatureBreakdown({ flags, sentimentLabel, wordCount, confidenceLow, confidenceHigh }) {
  return (
    <div className="breakdown-container">
      <div className="breakdown-header">
        <span className="breakdown-title">Signal Analysis</span>
        <div className="breakdown-meta">
          <span className="meta-chip">{wordCount} words</span>
          <span className="meta-chip">{sentimentLabel}</span>
          <span className="meta-chip">CI: {confidenceLow}–{confidenceHigh}%</span>
        </div>
      </div>

      {flags.length === 0 ? (
        <div className="no-flags">
          <div className="no-flags-icon">✦</div>
          <div>No deception signals detected</div>
          <div className="no-flags-sub">Statement appears linguistically clean</div>
        </div>
      ) : (
        <div className="flags-list">
          {flags.map((flag, i) => (
            <FlagBar key={i} flag={flag} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}