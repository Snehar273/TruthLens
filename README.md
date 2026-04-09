<div align="center">

<!-- LOGO -->
<!-- <img src="https://raw.githubusercontent.com/Snehar273/TruthLens/main/public/logo.svg" width="80" height="80" alt="TruthLens Logo" /> -->

# TruthLens
### AI-Powered Behavioral Text Analysis & Deception Detection System

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.1-FF6B35?style=flat-square)](https://groq.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?style=flat-square&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**[🔴 Live Demo](https://truthlens.vercel.app)** · **[🐛 Report Bug](https://github.com/Snehar273/TruthLens/issues)**

<br/>

> *"Multi-layer deception analysis using rule-based signals, sentiment evaluation, and LLM reasoning."*

<br/>


</div>

---

## 🧠 What is TruthLens?

**TruthLens** is a web-based intelligent behavioral analysis system that estimates the likelihood of deception in any given text statement. It combines three independent analysis layers — rule-based linguistics, sentiment evaluation, and large language model reasoning — to produce explainable, human-like insights.

This is **not** just an AI chatbot. It's a **hybrid behavioral analysis engine** that gives you:
- A **Truth Score** (0–100%)
- A **Lie Probability** percentage
- A **Confidence Interval** (±5%)
- **Signal-level breakdown** (what triggered the score)
- **AI-generated reasoning** (the psychology behind it)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔬 **Rule-Based Engine** | Detects 7 behavioral deception patterns in real-time |
| 📊 **Sentiment Analysis** | Evaluates emotional tone using NLP scoring |
| 🎯 **Hybrid Scoring** | Combines rule penalty + sentiment for accurate truth score |
| 🤖 **Groq AI Insight** | Llama 3.1 generates human-like behavioral explanations |
| 🌡️ **Deception Heatmap** | Word-by-word color-coded signal visualization |
| 📈 **Confidence Timeline** | Sentence-by-sentence truth score line chart |
| ⚖️ **Comparison Mode** | Analyze two statements side-by-side |
| 🔥 **Roast Mode** | Savage AI-generated fun response (Gen Z style) |
| ⬆️ **Share Result** | Download SVG card or copy text summary |
| ⌨️ **Typing Behavior** | Tracks backspaces, pauses, hesitation patterns |
| 🕐 **Analysis History** | Last 10 analyses saved in localStorage |
| ⚡ **Zero Backend** | Runs entirely in the browser — no server needed |

---

## 🎯 How It Works

```
User Input
    │
    ▼
┌─────────────────────────────────────────────────┐
│              LAYER 1: Rule Engine               │
│  ┌──────────────┐  ┌─────────────────────────┐  │
│  │  Suspicious  │  │  Over-Explanation Check │  │
│  │   Phrases    │  │  (word count > 35)      │  │
│  └──────────────┘  └─────────────────────────┘  │
│  ┌──────────────┐  ┌─────────────────────────┐  │
│  │  Deflection  │  │  Word Repetition Check  │  │
│  │  Detection   │  │  (3+ occurrences)       │  │
│  └──────────────┘  └─────────────────────────┘  │
│  ┌──────────────┐  ┌─────────────────────────┐  │
│  │    Vague     │  │  Contradiction Keywords │  │
│  │   Language   │  │  (but/however/although) │  │
│  └──────────────┘  └─────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐ │
│  │     Emotional Stress Signals (!!!, CAPS)    │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────┬───────────────────────────────┘
                  │ penalty score
                  ▼
┌─────────────────────────────────────────────────┐
│           LAYER 2: Scoring Engine               │
│                                                 │
│  BASE SCORE = 85                                │
│  truthScore = 85 - rulePenalty                  │
│                 - sentimentPenalty              │
│                 - lengthPenalty                 │
│  lieProbability = 100 - truthScore              │
│  confidenceInterval = truthScore ± 5%           │
└─────────────────┬───────────────────────────────┘
                  │ scores + flags
                  ▼
┌─────────────────────────────────────────────────┐
│              LAYER 3: Groq AI                   │
│                                                 │
│  Model: llama-3.1-8b-instant                    │
│  Input: statement + scores + flags              │
│  Output: 2-3 sentence behavioral insight        │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │  Final Result  │
         │  Truth Score   │
         │  AI Insight    │
         │  Signal Chart  │
         │  Heatmap       │
         │  Timeline      │
         └────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- A free [Groq API key](https://console.groq.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Snehar273/TruthLens.git

# 2. Navigate into the project
cd lie_detector

# 3. Install dependencies
npm install

# 4. Create environment file
echo "VITE_GROQ_API_KEY=your_groq_api_key_here" > .env

# 5. Start development server
npm run dev
```

Open **http://localhost:5173** and you're good to go! 🎉

---

## ⚙️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | UI framework and build tool |
| **Styling** | Custom CSS + Tailwind | Dark theme, animations, layout |
| **Fonts** | Syne + DM Mono | Display and monospace typography |
| **Sentiment** | `sentiment` npm library | NLP emotional tone analysis |
| **Rule Engine** | Vanilla JavaScript | Behavioral pattern detection |
| **AI Layer** | Groq API (Llama 3.1) | Natural language reasoning |
| **Storage** | Browser localStorage | Analysis history persistence |
| **Deployment** | Vercel | Free hosting and CI/CD |

---

## 🧩 Project Structure

```
lie_detector/
├── public/
├── src/
│   ├── components/
│   │   ├── ChatInput.jsx          # User input with example chips
│   │   ├── ResultCard.jsx         # Main result display with tabs
│   │   ├── TruthMeter.jsx         # Animated circular score ring
│   │   ├── FeatureBreakdown.jsx   # Signal bar chart breakdown
│   │   ├── DeceptionHeatmap.jsx   # Word-by-word color coding
│   │   ├── ConfidenceTimeline.jsx # Sentence-level SVG chart
│   │   ├── ComparisonMode.jsx     # Side-by-side analysis modal
│   │   ├── ShareCard.jsx          # Download/copy result card
│   │   ├── RoastMode.jsx          # Fun AI roast generator
│   │   ├── TypingBehavior.jsx     # Keystroke pattern analyzer
│   │   └── HistorySidebar.jsx     # localStorage history panel
│   ├── utils/
│   │   ├── ruleEngine.js          # 7-layer behavioral rule checker
│   │   ├── scoringEngine.js       # Truth score formula + sentiment
│   │   └── groqService.js         # Groq API integration
│   ├── App.jsx                    # Main app layout + state
│   ├── App.css                    # Complete theme + component styles
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Tailwind import
├── index.html                     # Custom SVG favicon + meta
├── vite.config.js                 # Vite + Tailwind config
├── .env                           # 🔒 API key (never commit!)
├── .gitignore
└── package.json
```

---

## 🔬 Detection Signals

TruthLens detects **7 behavioral deception patterns**:

| Signal | Example | Penalty |
|---|---|---|
| **Persuasive Phrases** | "trust me", "honestly", "I swear" | -12 per phrase |
| **Deflection Language** | "why would I", "that's ridiculous" | -10 per instance |
| **Vague Language** | "maybe", "I think", "I guess" | -7 per indicator |
| **Over-Explanation** | Word count > 35 words | -3 to -20 |
| **Word Repetition** | Same word 3+ times | -8 per word |
| **Contradictions** | 2+ "but/however/although" | -10 |
| **Stress Signals** | "!!!", ALL CAPS words | -8 |

---

## 💰 Cost Breakdown

This entire application is **100% free** to build and run:

| Service | Free Tier |
|---|---|
| Groq API | 14,400 requests/day free |
| Vercel Hosting | Unlimited free deployments |
| GitHub | Free public repositories |
| All npm packages | Open source / free |

**Total monthly cost: ₹0** 🎉

---

## 🌟 Example Analysis

**Input:**
> *"Trust me bro I didn't do anything honestly, I swear to god I would never do something like that"*

**Output:**
```
Truth Score:    38%
Lie Probability: 62%
Verdict:        Suspicious
Confidence:     33–43%

Signals Detected:
  • Persuasive Phrases (-24pts): "trust me", "honestly", "swear to god"
  • Over-Explanation (-15pts): 22 words — unusually detailed
  • Contradictory Language (-10pts): Multiple conflicting connectors

AI Insight:
  The repeated use of trust-building phrases like "trust me" and
  "I swear to god" suggests the speaker is compensating for a lack
  of genuine conviction. Over-explanation is a common behavioral
  indicator of stress or guilt — truthful people rarely feel the
  need to over-justify a denial.
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

Then on [vercel.com](https://vercel.com):
1. Import GitHub repository
2. Add `VITE_GROQ_API_KEY` in Environment Variables
3. Deploy → Done! 🎉

---

## ⚠️ Disclaimer

TruthLens is an **experimental educational tool** built for research and learning purposes. The results are **probabilistic estimates** based on linguistic patterns — they are **not** definitive truth determinations and should not be used for:

- Legal proceedings or investigations
- HR or hiring decisions
- Diagnosing any individual
- Any form of surveillance

The system analyzes text patterns, not people. Results vary based on writing style, cultural context, and individual expression.

---

## 🔮 Future Roadmap

- [ ] Voice input + audio analysis
- [ ] Multi-language support (Tamil, Hindi, etc.)
- [ ] User authentication + cloud history
- [ ] Browser extension for real-time analysis
- [ ] Batch analysis mode (multiple statements)
- [ ] API endpoint for developers

---

## 👨‍💻 Author

Built with ❤️ and zero budget by **Sneha**

> *"I developed a hybrid deception detection system that combines rule-based linguistic analysis, sentiment evaluation, and LLM-based reasoning using Groq to estimate truthfulness in textual communication."*

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<div align="center">

**⭐ Star this repo if you found it useful!**

Made with React + Groq + zero rupees 🚀

</div>
