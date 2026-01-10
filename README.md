# 🔍 Nexo - AI Fake News Detector

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" />
</p>

Nexo is an advanced AI-powered system designed to detect AI-generated fake news and manipulated content using neural analysis techniques. With a multi-algorithm approach, it provides comprehensive analysis and detailed explanations to help identify potentially misleading content.

## ✨ Features

### 🔬 Multi-Algorithm Detection
- **Perplexity Analysis**: Measures text predictability patterns using language models
- **Semantic Consistency**: Analyzes logical flow and topic coherence
- **Watermark Detection**: Identifies hidden patterns and statistical signatures
- **Writing Style Analysis**: Evaluates lexical diversity and entropy metrics

### 📊 Analysis & Reporting
- **AI-Origin Probability**: Estimates human-written vs AI-generated likelihood
- **Headline Consistency Check**: Semantic similarity analysis between headlines and content
- **Fact Verification**: Cross-references claims with trusted sources (Wikipedia)
- **Style Signature Analysis**: Unique stylistic fingerprints using sentence rhythm and vocabulary
- **Paraphrase Attack Detection**: Identifies AI-paraphrased content
- **Deep Explanation Generator**: Detailed summaries explaining flagged content

### 📁 File Support
- **Text Input**: Direct text analysis
- **File Upload**: PDF, Word (.docx), and plain text files
- **PDF Export**: Download comprehensive analysis reports

### 🤖 Self-Learning
- **Pattern Recognition**: Stores analyzed patterns to detect similar suspicious content
- **Adaptive Detection**: Improves accuracy over time with usage

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn installed

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nexo-ai-detector.git
cd nexo-ai-detector
npm install
npm run dev
```

Visit `http://localhost:5173` to access the application.

## 📖 Usage Guide

### 1. Input Your Content
- **Option A**: Paste article text directly into the text area
- **Option B**: Upload supported files (PDF, DOCX, TXT)
- **Option C**: Enter both headline and body text for enhanced analysis

### 2. Run Analysis
Click the **"Analyze News"** button to initiate the multi-algorithm detection process.

### 3. Review Results
The dashboard provides:
- **Overall Authenticity Score**: Composite score from all detection modules
- **Individual Module Scores**: Detailed breakdown by detection method
- **Visual Analytics**: AI-Origin probability chart, Style signature radar chart, Risk level indicators
- **Sentence-Level Analysis**: Highlighted suspicious sentences with confidence levels
- **Fact Check Results**: Verification against reliable sources
- **Comprehensive Explanation**: AI-generated summary of findings

### 4. Export & Share
Generate and download PDF reports for documentation or sharing purposes.

## 🏗️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **UI Components** | shadcn/ui |
| **Charts & Visualization** | Recharts |
| **PDF Generation** | jsPDF |
| **Document Parsing** | pdf.js, mammoth |

## 🧠 Detection Methodology

### Perplexity Analysis
Measures how "surprising" text is to a language model. AI-generated content often exhibits lower perplexity due to predictable statistical patterns.

### Semantic Consistency
Evaluates logical flow and topic coherence throughout the text. Detects unnatural topic shifts and contradictions common in AI-generated content.

### Watermark Detection
Identifies subtle statistical patterns and token repetitions that serve as fingerprints of AI text generators, including burstiness analysis.

### Writing Style Analysis
Computes unique stylistic fingerprints using:
- Sentence length and rhythm patterns
- Punctuation frequency and distribution
- Vocabulary spread and lexical diversity
- Entropy metrics for writing uniformity

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Format code
npm run format
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

Nexo is a tool designed to assist in content analysis. While it uses advanced algorithms to detect potential AI-generated content, no detection system is 100% accurate. Use results as one of multiple factors in your content evaluation process.

---

<p align="center">
  Made with ❤️ by the Nexo Team • Empowering truth in the age of AI-generated content
</p>
