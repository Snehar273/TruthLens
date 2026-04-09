const SUSPICIOUS_PHRASES = [
  "trust me", "honestly", "i swear", "believe me", "i promise",
  "to be honest", "truthfully", "i'm not lying", "i would never",
  "you have to believe", "i'm telling the truth", "swear to god",
  "hand on heart", "i kid you not", "no seriously", "i guarantee",
  "100%", "absolutely", "definitely", "without a doubt", "for real"
];

const DEFLECTION_PHRASES = [
  "why would i", "why would anyone", "that's ridiculous", "how dare you",
  "i can't believe you", "you're accusing me", "everyone knows", "ask anyone"
];

const VAGUE_PHRASES = [
  "i don't remember", "i don't recall", "i'm not sure", "maybe",
  "kind of", "sort of", "i think", "i guess", "probably", "possibly"
];

const OVER_EXPLANATION_THRESHOLD = 35;
const REPETITION_THRESHOLD = 3;

export function analyzeWithRules(text) {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  const flags = [];
  let penalty = 0;

  // 1. Suspicious/persuasive phrases
  const foundPhrases = SUSPICIOUS_PHRASES.filter(p => lower.includes(p));
  if (foundPhrases.length > 0) {
    const p = foundPhrases.length * 12;
    penalty += p;
    flags.push({
      label: "Persuasive Phrases",
      detail: `"${foundPhrases.slice(0, 3).join('", "')}"`,
      penalty: p,
      color: "red"
    });
  }

  // 2. Deflection
  const foundDeflection = DEFLECTION_PHRASES.filter(p => lower.includes(p));
  if (foundDeflection.length > 0) {
    const p = foundDeflection.length * 10;
    penalty += p;
    flags.push({
      label: "Deflection Detected",
      detail: `Redirecting blame or questioning`,
      penalty: p,
      color: "orange"
    });
  }

  // 3. Vagueness
  const foundVague = VAGUE_PHRASES.filter(p => lower.includes(p));
  if (foundVague.length >= 2) {
    const p = foundVague.length * 7;
    penalty += p;
    flags.push({
      label: "Vague Language",
      detail: `${foundVague.length} vague indicators found`,
      penalty: p,
      color: "yellow"
    });
  }

  // 4. Over-explanation
  if (words.length > OVER_EXPLANATION_THRESHOLD) {
    const extra = Math.min(Math.floor((words.length - OVER_EXPLANATION_THRESHOLD) / 5) * 3, 20);
    penalty += extra;
    flags.push({
      label: "Over-Explanation",
      detail: `${words.length} words — unusually detailed`,
      penalty: extra,
      color: "orange"
    });
  }

  // 5. Repetition
  const wordFreq = {};
  words.forEach(w => { if (w.length > 4) wordFreq[w] = (wordFreq[w] || 0) + 1; });
  const repeated = Object.entries(wordFreq).filter(([_, c]) => c >= REPETITION_THRESHOLD).map(([w]) => w);
  if (repeated.length > 0) {
    const p = repeated.length * 8;
    penalty += p;
    flags.push({
      label: "Word Repetition",
      detail: `"${repeated.slice(0, 3).join('", "')}" repeated`,
      penalty: p,
      color: "yellow"
    });
  }

  // 6. Contradictions
  const contradictions = ["but", "however", "although", "except", "unless", "yet"];
  const foundContradictions = contradictions.filter(w => lower.includes(w));
  if (foundContradictions.length >= 2) {
    penalty += 10;
    flags.push({
      label: "Contradictory Language",
      detail: `Multiple conflicting connectors`,
      penalty: 10,
      color: "red"
    });
  }

  // 7. Emotional stress signals
  const excessivePunct = (text.match(/[!?]{2,}/g) || []).length;
  const allCapsWords = (text.match(/\b[A-Z]{3,}\b/g) || []).length;
  if (excessivePunct > 0 || allCapsWords > 1) {
    penalty += 8;
    flags.push({
      label: "Emotional Stress Signals",
      detail: `Excessive punctuation or capitalization`,
      penalty: 8,
      color: "orange"
    });
  }

  // Extract highlighted suspicious words for UI
  const highlights = [
    ...foundPhrases,
    ...foundDeflection,
    ...foundVague
  ];

  return { flags, penalty, highlights };
}