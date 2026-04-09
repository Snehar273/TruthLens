import { useRef, useState } from "react";

export default function ShareCard({ result, inputText, onClose }) {
  const cardRef = useRef(null);
  const [copying, setCopying] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const { scores } = result;

  const getColor = (s) => s >= 75 ? "#4ade80" : s >= 55 ? "#facc15" : s >= 35 ? "#fb923c" : "#f87171";
  const color = getColor(scores.truthScore);

  const getMeterPath = (score) => {
    const r = 45;
    const cx = 60, cy = 60;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (score / 100) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = score > 50 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Download as image using Canvas
  const handleDownload = async () => {
    setDownloaded(true);
    const card = cardRef.current;
    if (!card) return;

    try {
      // Use html2canvas-like approach via SVG foreignObject
      const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="340">
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#0a0d15"/>
              <stop offset="100%" stop-color="#060810"/>
            </linearGradient>
            <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#a78bfa"/>
              <stop offset="100%" stop-color="#38bdf8"/>
            </linearGradient>
          </defs>
          <!-- Background -->
          <rect width="600" height="340" fill="url(#bg)" rx="16"/>
          <rect width="600" height="340" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" rx="16"/>

          <!-- Header -->
          <circle cx="36" cy="36" r="14" fill="none" stroke="url(#accent)" stroke-width="1.5"/>
          <circle cx="36" cy="36" r="5" fill="url(#accent)"/>
          <text x="58" y="32" fill="#a78bfa" font-family="monospace" font-size="14" font-weight="bold">TruthLens</text>
          <text x="58" y="46" fill="#454a58" font-family="monospace" font-size="9">BEHAVIORAL ANALYSIS</text>

          <!-- Statement -->
          <rect x="24" y="68" width="552" height="1" fill="rgba(255,255,255,0.07)"/>
          <text x="24" y="92" fill="#454a58" font-family="monospace" font-size="9" letter-spacing="1">ANALYZED STATEMENT</text>
          <text x="24" y="112" fill="#8b909e" font-family="sans-serif" font-size="12" 
            width="552">${inputText.slice(0, 80)}${inputText.length > 80 ? "…" : ""}</text>

          <!-- Score ring -->
          <circle cx="80" cy="210" r="45" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="8"/>
          <path d="${getMeterPath(scores.truthScore)}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
          <text x="80" y="206" fill="${color}" font-family="monospace" font-size="20" font-weight="bold" text-anchor="middle">${scores.truthScore}%</text>
          <text x="80" y="222" fill="#454a58" font-family="monospace" font-size="8" text-anchor="middle">TRUTH</text>

          <!-- Verdict -->
          <text x="160" y="185" fill="${color}" font-family="sans-serif" font-size="20" font-weight="bold">${scores.verdictEmoji} ${scores.verdict}</text>
          <text x="162" y="208" fill="#8b909e" font-family="monospace" font-size="11">Truthful: ${scores.truthScore}%  ·  Deceptive: ${scores.lieProbability}%</text>
          <text x="162" y="226" fill="#8b909e" font-family="monospace" font-size="11">Sentiment: ${scores.sentimentLabel}  ·  CI: ${scores.confidenceLow}–${scores.confidenceHigh}%</text>

          <!-- Divider -->
          <rect x="24" y="250" width="552" height="1" fill="rgba(255,255,255,0.07)"/>

          <!-- Footer -->
          <text x="24" y="276" fill="#454a58" font-family="monospace" font-size="9">⚠ Experimental AI tool — for educational purposes only</text>
          <text x="576" y="276" fill="#454a58" font-family="monospace" font-size="9" text-anchor="end">truthlens.vercel.app</text>

          <!-- Flags -->
          ${result.flags.slice(0, 3).map((f, i) => `
            <rect x="${24 + i * 186}" y="290" width="178" height="28" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
            <text x="${34 + i * 186}" y="309" fill="#8b909e" font-family="monospace" font-size="9">${f.label} (-${f.penalty}pts)</text>
          `).join("")}
          ${result.flags.length === 0 ? `
            <rect x="24" y="290" width="552" height="28" rx="6" fill="rgba(74,222,128,0.06)" stroke="rgba(74,222,128,0.15)" stroke-width="1"/>
            <text x="300" y="309" fill="#4ade80" font-family="monospace" font-size="9" text-anchor="middle">✦ No deception signals detected</text>
          ` : ""}
        </svg>
      `;

      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `truthlens-analysis-${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => setDownloaded(false), 2000);
  };

  // Copy text summary
  const handleCopy = async () => {
    setCopying(true);
    const summary = `TruthLens Analysis
━━━━━━━━━━━━━━━━
Statement: "${inputText}"

Truth Score: ${scores.truthScore}%
Lie Probability: ${scores.lieProbability}%
Verdict: ${scores.verdict}
Sentiment: ${scores.sentimentLabel}
Confidence: ${scores.confidenceLow}–${scores.confidenceHigh}%

Signals Detected:
${result.flags.length === 0 ? "✦ No deception signals detected" : result.flags.map(f => `• ${f.label}: ${f.detail}`).join("\n")}

AI Insight:
${result.aiInsight}

— Analyzed by TruthLens (AI-powered behavioral analysis)`;

    await navigator.clipboard.writeText(summary).catch(() => {});
    setTimeout(() => setCopying(false), 2000);
  };

  return (
    <div className="share-overlay">
      <div className="share-modal">
        <div className="share-modal-header">
          <span className="share-title">Share Result</span>
          <button className="comp-close" onClick={onClose}>✕</button>
        </div>

        {/* Preview Card */}
        <div ref={cardRef} className="share-card-preview">
          {/* Header */}
          <div className="share-card-top">
            <div className="share-card-logo">
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="17" stroke="url(#sg)" strokeWidth="1.5"/>
                <circle cx="18" cy="18" r="5.5" fill="url(#sg)"/>
                <path d="M7 18 C11 11, 25 11, 29 18 C25 25, 11 25, 7 18Z" stroke="url(#sg)" strokeWidth="1.2" fill="none"/>
                <defs>
                  <linearGradient id="sg" x1="0" y1="0" x2="36" y2="36">
                    <stop offset="0%" stopColor="#a78bfa"/>
                    <stop offset="100%" stopColor="#38bdf8"/>
                  </linearGradient>
                </defs>
              </svg>
              <div>
                <div className="share-card-appname">TruthLens</div>
                <div className="share-card-subtitle">Behavioral Analysis</div>
              </div>
            </div>
            <div className="share-card-badge" style={{ color, borderColor: `${color}40` }}>
              {scores.verdictEmoji} {scores.verdict}
            </div>
          </div>

          <div className="share-card-divider"/>

          {/* Statement */}
          <div className="share-card-statement">
            "{inputText.slice(0, 120)}{inputText.length > 120 ? "…" : ""}"
          </div>

          {/* Scores */}
          <div className="share-card-scores">
            <div className="share-score-item">
              <div className="share-score-val" style={{ color }}>{scores.truthScore}%</div>
              <div className="share-score-label">Truthful</div>
            </div>
            <div className="share-score-divider"/>
            <div className="share-score-item">
              <div className="share-score-val" style={{ color: "#f87171" }}>{scores.lieProbability}%</div>
              <div className="share-score-label">Deceptive</div>
            </div>
            <div className="share-score-divider"/>
            <div className="share-score-item">
              <div className="share-score-val" style={{ color: "var(--accent-blue)" }}>{scores.sentimentLabel}</div>
              <div className="share-score-label">Sentiment</div>
            </div>
          </div>

          {/* Flags */}
          <div className="share-card-flags">
            {result.flags.length === 0
              ? <span className="share-clean">✦ No deception signals detected</span>
              : result.flags.slice(0, 3).map((f, i) => (
                  <div key={i} className="share-flag-chip">{f.label}</div>
                ))
            }
          </div>

          <div className="share-card-footer">
            ⚠ Experimental AI tool · Educational purposes only
          </div>
        </div>

        {/* Actions */}
        <div className="share-actions">
          <button className="share-btn download" onClick={handleDownload}>
            {downloaded ? "✓ Downloaded!" : "⬇ Download SVG"}
          </button>
          <button className="share-btn copy" onClick={handleCopy}>
            {copying ? "✓ Copied!" : "⎘ Copy Text"}
          </button>
        </div>
      </div>
    </div>
  );
}
