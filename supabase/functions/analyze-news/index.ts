import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, headline } = await req.json();
    
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if text looks like binary/PDF data (only check for clear binary indicators)
    if (text.startsWith('%PDF-') || text.includes('\u0000')) {
      return new Response(
        JSON.stringify({ error: 'Binary or PDF files cannot be analyzed. Please paste plain text or use a .txt file.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limit text length to prevent excessive API costs
    const maxLength = 50000; // ~50k characters
    const analysisText = text.length > maxLength ? text.substring(0, maxLength) : text;
    
    if (text.length > maxLength) {
      console.log(`Text truncated from ${text.length} to ${maxLength} characters`);
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing text of length:', text.length);
    if (headline) {
      console.log('Analyzing with headline:', headline.substring(0, 50));
    }

    const headlinePrompt = headline 
      ? `\n\nHeadline-Body Consistency Check:
Additionally, analyze the semantic similarity between the provided headline and article body. If they are semantically inconsistent (e.g., headline promises content not delivered in body), include a "headlineConsistency" field with:
{
  "score": <number 0-100, where 100 = perfect match, 0 = completely unrelated>,
  "explanation": "Brief explanation of consistency or mismatch"
}

Headline: "${headline}"`
      : '';

    // Perform AI analysis using Lovable AI Gateway with enhanced detection
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'system',
            content: `You are Nexo, an advanced AI system for detecting AI-generated fake news, misinformation, and manipulated content using multi-signal forensic analysis.

Perform DEEP linguistic forensic analysis on the provided text. Apply rigorous statistical and pattern-based detection methods.

## CORE DETECTION MODULES (0-100 scores, where LOWER = more AI-like/suspicious):

### 1. PERPLEXITY SCORE
Analyze token-level predictability using language model principles:
- Measure how "surprising" word choices are in context
- AI text has LOW perplexity (predictable, template-like sequences)
- Human text has HIGHER perplexity (creative, unexpected phrasings)
- Check for: repetitive sentence starters, formulaic transitions, predictable conclusions
Score: 0 = highly predictable (AI), 100 = naturally unpredictable (human)

### 2. SEMANTIC COHERENCE SCORE  
Analyze semantic flow and logical consistency:
- Detect topic drift between paragraphs
- Identify logical non-sequiturs and disconnected ideas
- Check for circular reasoning or self-contradictions
- Measure argument structure coherence
Score: 0 = poor coherence/manipulated, 100 = excellent logical flow

### 3. WATERMARK FINGERPRINT SCORE
Detect neural network generation signatures:
- Burstiness patterns (uniform vs varied sentence rhythms)
- Token repetition frequency and distribution
- Phrase-level patterns (AI often reuses similar constructions)
- Statistical uniformity in word choice distribution
Score: 0 = strong AI signatures, 100 = natural human patterns

### 4. WRITING STYLE SCORE
Measure linguistic diversity and authenticity:
- Lexical diversity (Type-Token Ratio analysis)
- Syntactic variety (sentence structure variation)
- Voice consistency and personality markers
- Idiomatic usage and colloquialisms
Score: 0 = low diversity/mechanical, 100 = rich/authentic

### 5. EMOTIONAL MANIPULATION SCORE (NEW)
Detect persuasion and manipulation tactics:
- Fear-mongering language and urgency cues
- Loaded/biased language and emotional triggers
- Clickbait patterns and sensationalism
- Appeal to outrage, fear, or tribalism
- Logical fallacy indicators (ad hominem, straw man, false dichotomy)
Score: 0 = heavy manipulation, 100 = neutral/balanced

### 6. SOURCE CREDIBILITY SIGNALS (NEW)
Analyze journalistic quality indicators:
- Attribution of claims (named sources vs "experts say")
- Specificity of details (vague generalizations vs concrete facts)
- Hedging language balance (appropriate uncertainty vs overconfidence)
- Professional tone vs sensationalism
Score: 0 = poor credibility signals, 100 = high journalistic standards

### 7. STYLE SIGNATURE FINGERPRINT
Compute unique stylistic fingerprint:
- "sentenceRhythm": 0-100 (0 = robotic uniformity, 100 = natural variation)
- "punctuationFrequency": 0-100 (diversity in punctuation)
- "vocabularySpread": 0-100 (vocabulary range)
- "tokenTransitions": 0-100 (word-to-word naturalness)
- "matchesAiPattern": boolean (matches known AI patterns)
- "patternDescription": string (which AI patterns detected)

### 8. PARAPHRASE ATTACK DETECTION
Detect AI-assisted rewriting to evade detection:
- "suspicionScore": 0-100 (likelihood of AI paraphrasing)
- "embeddingVariance": 0-100 (sentence embedding uniformity)
- "synonymDensity": 0-100 (unnatural synonym substitution)
- "explanation": string (paraphrase indicators)

### 9. CLAIM EXTRACTION & VERIFICATION READINESS
Extract 3-5 key factual claims that can be fact-checked. For each claim:
- Assess verifiability (can this be independently verified?)
- Note specificity (concrete or vague?)

### 10. SENTENCE-LEVEL ANALYSIS
Identify 3-7 most suspicious sentences with individual risk scores and WHY they're suspicious.

### 11. AI-ORIGIN PROBABILITY
Using all signals, estimate:
- "aiOriginProbability": 0-100 (likelihood AI-generated)
- "humanOriginProbability": 0-100 (likelihood human-written)
Must sum to 100.

${headline ? '### 12. HEADLINE CONSISTENCY CHECK\nAnalyze semantic match between headline and body. Return "headlineConsistency" with score and explanation.' : ''}

### 13. DEEP EXPLANATION GENERATOR
Generate comprehensive explanation including:
- "summary": 2-3 sentence key findings overview
- "perplexityAnalysis": Specific examples of predictable/unpredictable patterns
- "semanticDriftAnalysis": Topic jumps, logical breaks with examples
- "repetitionAnalysis": Repeated phrases, patterns with frequency
- "factualAnalysis": Unverifiable claims, contradictions
- "stylisticAnalysis": Writing quality anomalies
- "emotionalAnalysis": Manipulation tactics detected (NEW)
- "credibilityAnalysis": Journalistic quality assessment (NEW)
- "conclusion": Final verdict with confidence level

## RESPONSE FORMAT (STRICT JSON):
{
  "perplexityScore": <number 0-100>,
  "semanticScore": <number 0-100>,
  "watermarkScore": <number 0-100>,
  "writingStyleScore": <number 0-100>,
  "emotionalManipulationScore": <number 0-100>,
  "sourceCredibilityScore": <number 0-100>,
  "aiOriginProbability": <number 0-100>,
  "humanOriginProbability": <number 0-100>,
  "styleSignature": {
    "sentenceRhythm": <number>,
    "punctuationFrequency": <number>,
    "vocabularySpread": <number>,
    "tokenTransitions": <number>,
    "matchesAiPattern": <boolean>,
    "patternDescription": "<string or null>"
  },
  "paraphraseAttack": {
    "suspicionScore": <number>,
    "embeddingVariance": <number>,
    "synonymDensity": <number>,
    "explanation": "<string>"
  },
  "deepExplanation": {
    "summary": "<string>",
    "perplexityAnalysis": "<string>",
    "semanticDriftAnalysis": "<string>",
    "repetitionAnalysis": "<string>",
    "factualAnalysis": "<string>",
    "stylisticAnalysis": "<string>",
    "emotionalAnalysis": "<string>",
    "credibilityAnalysis": "<string>",
    "conclusion": "<string>"
  },
  "extractedClaims": ["claim1", "claim2", "claim3"],
  "suspiciousSentences": [
    {"text": "sentence", "riskScore": <number>, "reason": "<why suspicious>"}
  ],
  "explanation": "<4-5 sentence summary with specific examples>"${headline ? ',\n  "headlineConsistency": {"score": <number>, "explanation": "..."}' : ''}
}

## SCORING CALIBRATION:
- 0-30: HIGH RISK (red) - Strong manipulation/AI signals
- 31-60: MEDIUM RISK (yellow) - Notable concerns
- 61-100: LOW RISK (green) - Appears authentic

Be thorough and cite specific text examples in your analysis.${headlinePrompt}`
          },
          {
            role: 'user',
            content: `Perform comprehensive forensic analysis on this text for AI-generation and misinformation detection:\n\n${analysisText}`
          }
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('AI Response received');
    
    const content = aiResponse.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON response from AI
    let analysisResult;
    try {
      let jsonString = content.trim();
      
      // Remove markdown code blocks if present
      // Handle various markdown formats: ```json\n...\n```, ```\n...\n```, or plain JSON
      if (jsonString.startsWith('```')) {
        // Find the first newline after opening backticks
        const firstNewline = jsonString.indexOf('\n');
        // Find the last occurrence of closing backticks
        const lastBackticks = jsonString.lastIndexOf('```');
        
        if (firstNewline !== -1 && lastBackticks > firstNewline) {
          jsonString = jsonString.substring(firstNewline + 1, lastBackticks).trim();
        }
      }
      
      analysisResult = JSON.parse(jsonString);
      
      // Validate required fields
      const requiredScores = [
        'perplexityScore', 'semanticScore', 'watermarkScore', 'writingStyleScore',
        'aiOriginProbability', 'humanOriginProbability'
      ];
      
      for (const field of requiredScores) {
        if (typeof analysisResult[field] !== 'number') {
          console.error(`Missing or invalid field: ${field}`);
          throw new Error(`Missing required score field: ${field}`);
        }
      }
      
      // Provide defaults for new optional scores
      analysisResult.emotionalManipulationScore = analysisResult.emotionalManipulationScore ?? 70;
      analysisResult.sourceCredibilityScore = analysisResult.sourceCredibilityScore ?? 70;
      
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      console.error('Parse error:', parseError);
      throw new Error('Invalid response format from AI');
    }

    // Calculate overall Nexo score (weighted average of 6 detection modules)
    // Enhanced weighting: core 4 modules + new manipulation/credibility signals
    const overallScore = Math.round(
      (analysisResult.perplexityScore * 0.20) +
      (analysisResult.semanticScore * 0.20) +
      (analysisResult.watermarkScore * 0.20) +
      (analysisResult.writingStyleScore * 0.15) +
      (analysisResult.emotionalManipulationScore * 0.15) +
      (analysisResult.sourceCredibilityScore * 0.10)
    );

    const finalResult = {
      overallScore,
      perplexityScore: analysisResult.perplexityScore,
      semanticScore: analysisResult.semanticScore,
      watermarkScore: analysisResult.watermarkScore,
      writingStyleScore: analysisResult.writingStyleScore,
      emotionalManipulationScore: analysisResult.emotionalManipulationScore,
      sourceCredibilityScore: analysisResult.sourceCredibilityScore,
      aiOriginProbability: analysisResult.aiOriginProbability,
      humanOriginProbability: analysisResult.humanOriginProbability,
      styleSignature: analysisResult.styleSignature || null,
      paraphraseAttack: analysisResult.paraphraseAttack || null,
      deepExplanation: analysisResult.deepExplanation || null,
      extractedClaims: analysisResult.extractedClaims || [],
      suspiciousSentences: analysisResult.suspiciousSentences || [],
      explanation: analysisResult.explanation || 'Multi-signal forensic analysis complete.',
      ...(analysisResult.headlineConsistency && { headlineConsistency: analysisResult.headlineConsistency })
    };

    console.log('Analysis complete, overall score:', overallScore);

    return new Response(
      JSON.stringify(finalResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Analysis failed'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
