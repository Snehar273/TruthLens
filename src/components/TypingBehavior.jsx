import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";

// Exposed via ref so parent can read the score
const TypingBehavior = forwardRef(({ disabled }, ref) => {
  const [text, setText] = useState("");
  const [behaviorScore, setBehaviorScore] = useState(null);
  const [signals, setSignals] = useState([]);
  const eventsRef = useRef([]);
  const lastKeyTime = useRef(null);
  const pausesRef = useRef([]);
  const backspacesRef = useRef(0);
  const hesitationsRef = useRef(0);

  useImperativeHandle(ref, () => ({
    getText: () => text,
    getScore: () => behaviorScore,
    reset: () => {
      setText("");
      setBehaviorScore(null);
      setSignals([]);
      eventsRef.current = [];
      pausesRef.current = [];
      backspacesRef.current = 0;
      hesitationsRef.current = 0;
      lastKeyTime.current = null;
    }
  }));

  const handleKeyDown = (e) => {
    const now = Date.now();

    if (e.key === "Backspace") {
      backspacesRef.current += 1;
    }

    if (lastKeyTime.current) {
      const gap = now - lastKeyTime.current;
      if (gap > 1500 && gap < 15000) {
        pausesRef.current.push(gap);
      }
      if (gap > 800 && gap < 1500) {
        hesitationsRef.current += 1;
      }
    }

    lastKeyTime.current = now;
    eventsRef.current.push({ key: e.key, time: now });
  };

  const computeScore = (value) => {
    if (value.length < 10) return;

    const wordCount = value.trim().split(/\s+/).length;
    const backspaceRatio = backspacesRef.current / Math.max(value.length, 1);
    const pauseCount = pausesRef.current.length;
    const avgPause = pausesRef.current.length > 0
      ? pausesRef.current.reduce((a, b) => a + b, 0) / pausesRef.current.length
      : 0;

    const detected = [];
    let penalty = 0;

    // High backspace ratio = editing/second-guessing
    if (backspaceRatio > 0.15) {
      penalty += 15;
      detected.push({ label: "Frequent Editing", detail: `${Math.round(backspaceRatio * 100)}% backspace ratio`, color: "orange" });
    }

    // Long pauses = thinking too hard
    if (pauseCount >= 2) {
      penalty += 10;
      detected.push({ label: "Long Pauses Detected", detail: `${pauseCount} pause(s) while typing`, color: "yellow" });
    }

    // Hesitations
    if (hesitationsRef.current >= 3) {
      penalty += 8;
      detected.push({ label: "Frequent Hesitation", detail: `${hesitationsRef.current} micro-pauses`, color: "orange" });
    }

    // Suspiciously fast typing (copy-paste)
    const totalTime = (eventsRef.current[eventsRef.current.length - 1]?.time - eventsRef.current[0]?.time) || 1;
    const wpm = (wordCount / (totalTime / 60000));
    if (wpm > 120 && wordCount > 8) {
      penalty += 12;
      detected.push({ label: "Unusually Fast Input", detail: `~${Math.round(wpm)} WPM — possible paste`, color: "red" });
    }

    const score = Math.max(5, Math.min(95, 85 - penalty));
    setBehaviorScore(score);
    setSignals(detected);
  };

  const handleChange = (e) => {
    setText(e.target.value);
    computeScore(e.target.value);
  };

  const getColor = (s) => s >= 75 ? "#4ade80" : s >= 55 ? "#facc15" : s >= 35 ? "#fb923c" : "#f87171";

  const colorMap = {
    red: { text: "#f87171", border: "rgba(248,113,113,0.25)", bg: "rgba(248,113,113,0.07)" },
    orange: { text: "#fb923c", border: "rgba(251,146,60,0.25)", bg: "rgba(251,146,60,0.07)" },
    yellow: { text: "#facc15", border: "rgba(250,204,21,0.2)", bg: "rgba(250,204,21,0.06)" },
  };

  return (
    <div className="typing-container">
      <div className="typing-header">
        <span className="typing-title">Typing Behavior Analysis</span>
        <span className="typing-sub">Real-time behavioral signal tracking</span>
      </div>

      <textarea
        className="typing-textarea"
        placeholder="Start typing here — we track HOW you type, not just what you type…"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={3}
      />

      <div className="typing-stats">
        <div className="typing-stat">
          <span className="typing-stat-val">{backspacesRef.current}</span>
          <span className="typing-stat-label">Backspaces</span>
        </div>
        <div className="typing-stat">
          <span className="typing-stat-val">{pausesRef.current.length}</span>
          <span className="typing-stat-label">Long Pauses</span>
        </div>
        <div className="typing-stat">
          <span className="typing-stat-val">{hesitationsRef.current}</span>
          <span className="typing-stat-label">Hesitations</span>
        </div>
        <div className="typing-stat">
          <span className="typing-stat-val">{text.trim() ? text.trim().split(/\s+/).length : 0}</span>
          <span className="typing-stat-label">Words</span>
        </div>
      </div>

      {behaviorScore !== null && (
        <div className="typing-result">
          <div className="typing-score-row">
            <span className="typing-score-label">Behavioral Score</span>
            <span className="typing-score-val" style={{ color: getColor(behaviorScore) }}>
              {behaviorScore}%
            </span>
          </div>
          <div className="typing-score-bar-track">
            <div
              className="typing-score-bar-fill"
              style={{
                width: `${behaviorScore}%`,
                background: getColor(behaviorScore),
                boxShadow: `0 0 8px ${getColor(behaviorScore)}60`
              }}
            />
          </div>

          {signals.length === 0 ? (
            <div className="typing-clean">✦ Natural typing pattern detected</div>
          ) : (
            <div className="typing-signals">
              {signals.map((s, i) => (
                <div key={i} className="typing-signal-chip"
                  style={{
                    color: colorMap[s.color]?.text,
                    borderColor: colorMap[s.color]?.border,
                    background: colorMap[s.color]?.bg
                  }}>
                  <span className="typing-signal-label">{s.label}</span>
                  <span className="typing-signal-detail">{s.detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

TypingBehavior.displayName = "TypingBehavior";
export default TypingBehavior;
