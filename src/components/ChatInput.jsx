import { useState, useRef, useEffect } from "react";

export default function ChatInput({ onAnalyze, isLoading }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const EXAMPLES = [
    "Trust me bro I didn't do anything honestly",
    "I swear I was home all night, you have to believe me",
    "I don't remember exactly but I think I was there maybe",
    "Why would I lie? That's absolutely ridiculous!",
    "I definitely did not take anything from the office"
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [text]);

  const handleSubmit = () => {
    if (text.trim().length < 3 || isLoading) return;
    onAnalyze(text.trim());
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const loadExample = (example) => {
    setText(example);
    textareaRef.current?.focus();
  };

  return (
    <div className="chat-input-section">
      {/* Example chips */}
      <div className="examples-label">Try an example →</div>
      <div className="examples-row">
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            className="example-chip"
            onClick={() => loadExample(ex)}
          >
            {ex.length > 38 ? ex.slice(0, 38) + "…" : ex}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className={`input-wrapper ${isLoading ? "loading" : ""}`}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type or paste a statement to analyze…"
          className="main-textarea"
          disabled={isLoading}
          rows={3}
        />

        <div className="input-footer">
          <span className="char-count">{text.length} chars · {text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
          <button
            className={`analyze-btn ${text.trim().length >= 3 && !isLoading ? "active" : "disabled"}`}
            onClick={handleSubmit}
            disabled={text.trim().length < 3 || isLoading}
          >
            {isLoading ? (
              <span className="btn-loading">
                <span className="dot-pulse" />
                Analyzing
              </span>
            ) : (
              <span>Analyze →</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}