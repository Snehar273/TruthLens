import Sentiment from "sentiment";

const sentimentAnalyzer = new Sentiment();

export function calculateScore(text, rulePenalty) {
  const BASE_SCORE = 85;

  // Sentiment analysis
  const result = sentimentAnalyzer.analyze(text);
  const sentimentScore = result.score;
  const comparative = result.comparative; // per-word sentiment

  // Sentiment adjustment: very negative or very positive = suspicious
  let sentimentPenalty = 0;
  let sentimentLabel = "Neutral";

  if (comparative > 1.5) {
    sentimentPenalty = 8;
    sentimentLabel = "Overly Positive";
  } else if (comparative < -1.5) {
    sentimentPenalty = 10;
    sentimentLabel = "Highly Negative";
  } else if (comparative >= 0.3 && comparative <= 1.5) {
    sentimentPenalty = 0;
    sentimentLabel = "Positive";
  } else if (comparative >= -1.5 && comparative < -0.3) {
    sentimentPenalty = 5;
    sentimentLabel = "Negative";
  }

  // Text length bonus (very short texts = less analyzable = slight penalty)
  const wordCount = text.split(/\s+/).length;
  const lengthPenalty = wordCount < 5 ? 10 : 0;

  // Final score
  let truthScore = BASE_SCORE - rulePenalty - sentimentPenalty - lengthPenalty;
  truthScore = Math.max(5, Math.min(95, truthScore)); // clamp between 5-95

  const lieProbability = 100 - truthScore;

  // Confidence range (±5 for realism)
  const confidenceLow = Math.max(0, truthScore - 5);
  const confidenceHigh = Math.min(100, truthScore + 5);

  // Verdict
  let verdict, verdictEmoji;
  if (truthScore >= 75) {
    verdict = "Likely Truthful";
    verdictEmoji = "✦";
  } else if (truthScore >= 55) {
    verdict = "Uncertain";
    verdictEmoji = "◈";
  } else if (truthScore >= 35) {
    verdict = "Suspicious";
    verdictEmoji = "◉";
  } else {
    verdict = "High Deception Risk";
    verdictEmoji = "⊗";
  }

  return {
    truthScore: Math.round(truthScore),
    lieProbability: Math.round(lieProbability),
    confidenceLow: Math.round(confidenceLow),
    confidenceHigh: Math.round(confidenceHigh),
    sentimentLabel,
    sentimentScore,
    verdict,
    verdictEmoji,
    wordCount
  };
}