import { useState, useEffect } from "react";
import TruthMeter from "./TruthMeter";
import FeatureBreakdown from "./FeatureBreakdown";
import DeceptionHeatmap from "./DeceptionHeatmap";
import ConfidenceTimeline from "./ConfidenceTimeline";
import ShareCard from "./ShareCard";
import RoastMode from "./RoastMode";

export default function ResultCard({ result, inputText }) {
  const [aiVisible, setAiVisible] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showRoast, setShowRoast] = useState(false);
  const [activeTab, setActiveTab] = useState("analysis"); // analysis | heatmap | timeline

  useEffect(() => {
    setShowText(false);
    setAiVisible(false);
    setActiveTab("analysis");
    const t1 = setTimeout(() => setShowText(true), 100);
    const t2 = setTimeout(() => setAiVisible(true), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [result]);

  const { scores, flags, aiInsight } = result;

  const highlightText = (text, highlights) => {
    if (!highlights || highlights.length === 0) return text;
    let result = text;
    const sorted = [...highlights].sort((a, b) => b.length - a.length);
    sorted.forEach(phrase => {
      const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      result = result.replace(regex, `<mark class="highlight-phrase">$1</mark>`);
    });
    return result;
  };

  const tabs = [
    { id: "analysis", label: "◈ Analysis" },
    { id: "heatmap", label: "⬡ Heatmap" },
    { id: "timeline", label: "◉ Timeline" },
  ];

  return (
    <>
      <div className={`result-card ${showText ? "visible" : ""}`}>

        {/* Analyzed statement */}
        <div className="analyzed-statement">
          <div className="statement-label">Analyzed Statement</div>
          <div
            className="statement-text"
            dangerouslySetInnerHTML={{ __html: highlightText(inputText, result.highlights) }}
          />
        </div>

        {/* Tab switcher */}
        <div className="result-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`result-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "analysis" && (
          <div className="analysis-grid">
            <TruthMeter
              truthScore={scores.truthScore}
              lieProbability={scores.lieProbability}
              verdict={scores.verdict}
              verdictEmoji={scores.verdictEmoji}
            />
            <FeatureBreakdown
              flags={flags}
              sentimentLabel={scores.sentimentLabel}
              wordCount={scores.wordCount}
              confidenceLow={scores.confidenceLow}
              confidenceHigh={scores.confidenceHigh}
            />
          </div>
        )}

        {activeTab === "heatmap" && (
          <DeceptionHeatmap text={inputText} />
        )}

        {activeTab === "timeline" && (
          <ConfidenceTimeline text={inputText} />
        )}

        {/* AI Insight */}
        <div className={`ai-insight-card ${aiVisible ? "visible" : ""}`}>
          <div className="ai-insight-header">
            <div className="ai-badge">
              <span className="ai-dot" />
              AI Insight
            </div>
            <span className="ai-powered">Powered by Groq · Llama 3.1</span>
          </div>
          <p className="ai-insight-text">
            {aiInsight || "Generating behavioral insight…"}
          </p>
        </div>

        {/* Action buttons */}
        <div className="result-actions">
          <button className="action-btn share-action" onClick={() => setShowShare(true)}>
            <span>⬆</span> Share Result
          </button>
          <button className="action-btn roast-action" onClick={() => setShowRoast(true)}>
            <span>🔥</span> Roast Mode
          </button>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer">
          ⚠ TruthLens is an experimental tool for educational purposes. Results are probabilistic estimates, not definitive truth determinations.
        </div>
      </div>

      {/* Modals */}
      {showShare && (
        <ShareCard result={result} inputText={inputText} onClose={() => setShowShare(false)} />
      )}
      {showRoast && (
        <RoastMode
          text={inputText}
          scores={scores}
          flags={flags}
          onClose={() => setShowRoast(false)}
        />
      )}
    </>
  );
}