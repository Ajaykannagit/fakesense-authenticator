// Self-Learning Mode: Pattern storage and matching using localStorage

export interface StoredPattern {
  id: string;
  timestamp: number;
  overallScore: number;
  perplexityScore: number;
  semanticScore: number;
  watermarkScore: number;
  writingStyleScore: number;
  aiOriginProbability: number;
  styleSignature?: {
    sentenceRhythm: number;
    punctuationFrequency: number;
    vocabularySpread: number;
    tokenTransitions: number;
  };
  textFingerprint: string; // Hash of key phrases
  isSuspicious: boolean;
}

export interface PatternMatchResult {
  similarity: number;
  matchedPatterns: string[];
  matchedArticleCount: number;
}

const STORAGE_KEY = "nexo-learned-patterns";
const MAX_PATTERNS = 50;

// Simple hash function for text fingerprinting
function simpleHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Extract key phrases for fingerprinting
function extractKeyPhrases(text: string): string {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 4);
  
  // Get most common words
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word)
    .join(' ');
  
  return simpleHash(topWords);
}

export function getStoredPatterns(): StoredPattern[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function savePattern(
  results: {
    overallScore: number;
    perplexityScore: number;
    semanticScore: number;
    watermarkScore: number;
    writingStyleScore: number;
    aiOriginProbability: number;
    styleSignature?: {
      sentenceRhythm: number;
      punctuationFrequency: number;
      vocabularySpread: number;
      tokenTransitions: number;
    };
  },
  text: string
): void {
  try {
    const patterns = getStoredPatterns();
    
    const newPattern: StoredPattern = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      overallScore: results.overallScore,
      perplexityScore: results.perplexityScore,
      semanticScore: results.semanticScore,
      watermarkScore: results.watermarkScore,
      writingStyleScore: results.writingStyleScore,
      aiOriginProbability: results.aiOriginProbability,
      styleSignature: results.styleSignature,
      textFingerprint: extractKeyPhrases(text),
      isSuspicious: results.overallScore < 50 || results.aiOriginProbability > 60
    };
    
    // Add new pattern and limit to MAX_PATTERNS
    const updatedPatterns = [newPattern, ...patterns].slice(0, MAX_PATTERNS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPatterns));
  } catch (error) {
    console.error("Failed to save pattern:", error);
  }
}

export function matchPatterns(
  results: {
    overallScore: number;
    perplexityScore: number;
    semanticScore: number;
    watermarkScore: number;
    writingStyleScore: number;
    aiOriginProbability: number;
    styleSignature?: {
      sentenceRhythm: number;
      punctuationFrequency: number;
      vocabularySpread: number;
      tokenTransitions: number;
    };
  },
  text: string
): PatternMatchResult | null {
  const patterns = getStoredPatterns();
  
  if (patterns.length === 0) {
    return null;
  }
  
  const currentFingerprint = extractKeyPhrases(text);
  const suspiciousPatterns = patterns.filter(p => p.isSuspicious);
  
  if (suspiciousPatterns.length === 0) {
    return null;
  }
  
  let maxSimilarity = 0;
  const matchedPatternTypes: Set<string> = new Set();
  let matchedCount = 0;
  
  for (const pattern of suspiciousPatterns) {
    // Calculate similarity based on scores
    const scoreSimilarity = calculateScoreSimilarity(results, pattern);
    
    // Check fingerprint match
    const fingerprintMatch = currentFingerprint === pattern.textFingerprint ? 30 : 0;
    
    // Calculate style signature similarity if available
    let styleSimilarity = 0;
    if (results.styleSignature && pattern.styleSignature) {
      styleSimilarity = calculateStyleSimilarity(results.styleSignature, pattern.styleSignature);
    }
    
    const totalSimilarity = Math.min(100, scoreSimilarity + fingerprintMatch + styleSimilarity);
    
    if (totalSimilarity > 40) {
      matchedCount++;
      
      // Identify matching pattern types
      if (Math.abs(results.perplexityScore - pattern.perplexityScore) < 15) {
        matchedPatternTypes.add("Low Perplexity");
      }
      if (Math.abs(results.semanticScore - pattern.semanticScore) < 15) {
        matchedPatternTypes.add("Semantic Drift");
      }
      if (Math.abs(results.watermarkScore - pattern.watermarkScore) < 15) {
        matchedPatternTypes.add("AI Watermark");
      }
      if (Math.abs(results.writingStyleScore - pattern.writingStyleScore) < 15) {
        matchedPatternTypes.add("Uniform Style");
      }
      if (results.aiOriginProbability > 60 && pattern.aiOriginProbability > 60) {
        matchedPatternTypes.add("AI-Generated");
      }
    }
    
    maxSimilarity = Math.max(maxSimilarity, totalSimilarity);
  }
  
  if (maxSimilarity < 40) {
    return null;
  }
  
  return {
    similarity: maxSimilarity,
    matchedPatterns: Array.from(matchedPatternTypes),
    matchedArticleCount: matchedCount
  };
}

function calculateScoreSimilarity(
  current: { perplexityScore: number; semanticScore: number; watermarkScore: number; writingStyleScore: number },
  stored: StoredPattern
): number {
  const perplexityDiff = Math.abs(current.perplexityScore - stored.perplexityScore);
  const semanticDiff = Math.abs(current.semanticScore - stored.semanticScore);
  const watermarkDiff = Math.abs(current.watermarkScore - stored.watermarkScore);
  const styleDiff = Math.abs(current.writingStyleScore - stored.writingStyleScore);
  
  const avgDiff = (perplexityDiff + semanticDiff + watermarkDiff + styleDiff) / 4;
  return Math.max(0, 40 - avgDiff);
}

function calculateStyleSimilarity(
  current: { sentenceRhythm: number; punctuationFrequency: number; vocabularySpread: number; tokenTransitions: number },
  stored: { sentenceRhythm: number; punctuationFrequency: number; vocabularySpread: number; tokenTransitions: number }
): number {
  const rhythmDiff = Math.abs(current.sentenceRhythm - stored.sentenceRhythm);
  const punctDiff = Math.abs(current.punctuationFrequency - stored.punctuationFrequency);
  const vocabDiff = Math.abs(current.vocabularySpread - stored.vocabularySpread);
  const transDiff = Math.abs(current.tokenTransitions - stored.tokenTransitions);
  
  const avgDiff = (rhythmDiff + punctDiff + vocabDiff + transDiff) / 4;
  return Math.max(0, 30 - avgDiff);
}

export function clearPatterns(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getPatternStats(): { total: number; suspicious: number } {
  const patterns = getStoredPatterns();
  return {
    total: patterns.length,
    suspicious: patterns.filter(p => p.isSuspicious).length
  };
}
