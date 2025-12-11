# Nexo - AI Fake News Detector

Nexo is an advanced AI-powered system designed to detect AI-generated fake news and manipulated content using neural analysis techniques.

## Features

- **Multi-Algorithm Detection**: Combines four independent detection algorithms (Perplexity, Semantic, Watermark, and Writing Style analysis)
- **AI-Origin Probability**: Estimates whether text is human-written vs AI-generated
- **Headline Consistency Check**: Analyzes semantic similarity between headlines and article body
- **Fact Verification**: Cross-references claims with trusted sources like Wikipedia
- **Style Signature Analysis**: Computes unique stylistic fingerprints using sentence rhythm, punctuation frequency, and vocabulary spread
- **Paraphrase Attack Detection**: Identifies articles heavily paraphrased using AI tools
- **Self-Learning Mode**: Stores patterns from analyzed texts to detect similar suspicious content
- **Deep Explanation Generator**: Provides detailed summaries explaining why content was flagged
- **PDF Export**: Download comprehensive analysis reports
- **Document Support**: Upload PDF, Word (.docx), and text files for analysis

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Document Parsing**: pdf.js, mammoth

## Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

1. **Enter Text**: Paste the article text you want to analyze in the text area
2. **Add Headline (Optional)**: Enter the article headline for consistency checking
3. **Upload File (Alternative)**: Upload a PDF, Word document, or text file
4. **Analyze**: Click the "Analyze News" button to start the analysis
5. **Review Results**: View the comprehensive analysis including:
   - Overall authenticity score
   - Individual detection scores
   - AI-Origin probability chart
   - Style signature radar chart
   - Suspicious sentences with risk levels
   - Fact verification results
   - Deep explanation of findings
6. **Export Report**: Download a PDF report of the analysis

## Detection Modules

### Perplexity Analysis
Measures text predictability patterns using language model analysis. AI-generated text often has lower perplexity due to its statistical patterns.

### Semantic Consistency
Analyzes logical flow and topic coherence. Detects unnatural topic shifts common in AI content.

### Watermark Detection
Identifies hidden patterns and statistical signatures left by AI text generators, including burstiness and token repetition analysis.

### Writing Style Analysis
Evaluates lexical diversity and entropy metrics to detect uniform AI writing patterns.

## License

MIT License
