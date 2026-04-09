import { useEffect, useState } from "react";

const STORAGE_KEY = "truthlens_history";

export function saveToHistory(text, score, verdict) {
  const history = getHistory();
  const entry = {
    id: Date.now(),
    text: text.slice(0, 80),
    score,
    verdict,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  };
  const updated = [entry, ...history].slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

export default function HistorySidebar({ history, onSelect, onClear }) {
  const getColor = (score) => {
    if (score >= 75) return "#4ade80";
    if (score >= 55) return "#facc15";
    if (score >= 35) return "#fb923c";
    return "#f87171";
  };

  if (history.length === 0) return null;

  return (
    <div className="history-sidebar">
      <div className="history-header">
        <span className="history-title">Recent Analyses</span>
        <button className="clear-btn" onClick={onClear}>Clear</button>
      </div>
      <div className="history-list">
        {history.map(entry => (
          <div
            key={entry.id}
            className="history-item"
            onClick={() => onSelect(entry.text)}
          >
            <div className="history-item-top">
              <span
                className="history-score"
                style={{ color: getColor(entry.score) }}
              >
                {entry.score}%
              </span>
              <span className="history-time">{entry.time}</span>
            </div>
            <div className="history-text">{entry.text}{entry.text.length >= 80 ? "…" : ""}</div>
            <div className="history-verdict" style={{ color: getColor(entry.score) }}>
              {entry.verdict}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}