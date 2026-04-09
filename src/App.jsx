import { useState } from "react";
import ChatInput from "./components/ChatInput";
import ResultCard from "./components/ResultCard";
import ComparisonMode from "./components/ComparisonMode";
import HistorySidebar, { saveToHistory, getHistory, clearHistory } from "./components/HistorySidebar";
import { analyzeWithRules } from "./utils/ruleEngine";
import { calculateScore } from "./utils/scoringEngine";
import { getGroqInsight } from "./utils/groqService";
import "./App.css";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: `${Math.random() * 3 + 1.5}px`,
  delay: `${Math.random() * 8}s`,
  duration: `${Math.random() * 6 + 6}s`,
}));

export default function App() {
  const [result, setResult] = useState(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState(getHistory());
  const [showHistory, setShowHistory] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [scanLine, setScanLine] = useState(false);

  const handleAnalyze = async (text) => {
    setIsLoading(true);
    setScanLine(true);
    setInputText(text);
    setResult(null);

    try {
      const { flags, penalty, highlights } = analyzeWithRules(text);
      const scores = calculateScore(text, penalty);
      setResult({ scores, flags, highlights, aiInsight: null });

      const aiInsight = await getGroqInsight(text, flags, scores);
      setResult({ scores, flags, highlights, aiInsight });

      const updated = saveToHistory(text, scores.truthScore, scores.verdict);
      setHistory(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setTimeout(() => setScanLine(false), 1400);
    }
  };

  const handleHistorySelect = (text) => {
    handleAnalyze(text);
    setShowHistory(false);
  };

  return (
    <div className="app">
      {/* Background */}
      <div className="bg-canvas">
        <div className="bg-beam" />
        <div className="bg-core" />
        <div className="bg-ring bg-ring-1" />
        <div className="bg-ring bg-ring-2" />
        <div className="bg-ring bg-ring-3" />
        <div className="bg-ring bg-ring-4" />
        {PARTICLES.map(p => (
          <div key={p.id} className="bg-particle" style={{
            left: p.left, top: p.top, width: p.size, height: p.size,
            animationDelay: p.delay, animationDuration: p.duration,
          }} />
        ))}
      </div>

      {scanLine && <div className="scan-line" />}

      {/* Header */}
      <header className="app-header">
        <div className="logo-group">
          <div className="logo-icon">
            <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="17" stroke="url(#lg1)" strokeWidth="1.5" />
              <circle cx="18" cy="18" r="6" fill="url(#lg1)" opacity="0.85" />
              <circle cx="18" cy="18" r="11" stroke="url(#lg1)" strokeWidth="1" strokeDasharray="3 2" opacity="0.45" />
              <path d="M7 18 C11 11, 25 11, 29 18 C25 25, 11 25, 7 18Z" stroke="url(#lg1)" strokeWidth="1.2" fill="none" opacity="0.6" />
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="36" y2="36">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-name">TruthLens</span>
            <span className="logo-tagline">Behavioral Text Analysis</span>
          </div>
        </div>

        <nav className="header-nav">
          <div className="nav-badge">AI-Powered</div>
          <button
            className="history-toggle"
            onClick={() => setShowComparison(true)}
            title="Compare two statements"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="3" x2="12" y2="21"/><polyline points="4,9 12,3 20,9"/>
            </svg>
            Compare
          </button>
          <button
            className={`history-toggle ${showHistory ? "active" : ""}`}
            onClick={() => setShowHistory(p => !p)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
            </svg>
            History
            {history.length > 0 && <span className="history-count">{history.length}</span>}
          </button>
        </nav>
      </header>

      {/* Main */}
      <main className="app-main">
        <div className={`main-layout ${result || isLoading ? "has-result" : ""}`}>

          {/* LEFT panel */}
          <div className="left-panel">
            {!result && !isLoading && (
              <div className="hero">
                <div className="hero-eyebrow">
                  <span className="eyebrow-dot" />
                  Linguistic · Behavioral · AI
                </div>
                <h1 className="hero-title">
                  Detect the truth<br />
                  <span className="hero-accent">behind the words</span>
                </h1>
                <p className="hero-sub">
                  Multi-layer deception analysis — rule engine, sentiment scoring,
                  heatmap, timeline, and LLM reasoning.
                </p>
              </div>
            )}

            {showHistory && (
              <HistorySidebar
                history={history}
                onSelect={handleHistorySelect}
                onClear={() => { clearHistory(); setHistory([]); }}
              />
            )}

            <ChatInput onAnalyze={handleAnalyze} isLoading={isLoading} />

            {isLoading && !result && (
              <div className="loading-state">
                <div className="loading-ring" />
                <div className="loading-steps">
                  <div className="loading-step active">Running rule engine…</div>
                  <div className="loading-step">Scoring behavioral signals…</div>
                  <div className="loading-step">Querying Groq AI…</div>
                </div>
              </div>
            )}

            {!result && !isLoading && (
              <div className="empty-state">
                <div className="empty-grid">
                  {["Linguistic Patterns", "Sentiment Analysis", "Behavioral Signals", "AI Reasoning"].map((item, i) => (
                    <div key={i} className="empty-card">
                      <div className="empty-card-icon">{["◈", "♦", "◉", "✦"][i]}</div>
                      <div className="empty-card-label">{item}</div>
                    </div>
                  ))}
                </div>
                <p className="empty-hint">Enter any statement above to begin</p>
              </div>
            )}
          </div>

          {/* RIGHT panel */}
          {(result || (isLoading && inputText)) && (
            <div className="right-panel">
              {result && <ResultCard result={result} inputText={inputText} />}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <span>TruthLens — Experimental AI Research Tool</span>
        <span className="footer-sep">·</span>
        <span>Built with Groq + React</span>
      </footer>

      {/* Comparison Mode Modal */}
      {showComparison && <ComparisonMode onClose={() => setShowComparison(false)} />}
    </div>
  );
}