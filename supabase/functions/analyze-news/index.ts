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

    // Perform AI analysis using Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are FakeSense, an expert AI system for detecting AI-generated fake news and manipulated content using multi-signal detection.

Your task is to analyze the provided text and return four specific detection scores (0-100):

1. PERPLEXITY SCORE (0-100): Using GPT-2 model analysis, measure text predictability patterns. AI-generated text has lower perplexity (more predictable token sequences). Score 0 = definitely AI-generated (very predictable), 100 = definitely human-written (natural unpredictability).

2. SEMANTIC DRIFT SCORE (0-100): Using sentence-embedding cosine similarity, detect semantic inconsistencies between consecutive sections. Manipulated content shows sudden topic shifts and logical breaks. Score 0 = high semantic drift (manipulated), 100 = perfect semantic flow (authentic).

3. WATERMARK FINGERPRINT SCORE (0-100): Analyze burstiness patterns and token repetition to detect neural fingerprints. Check for: repetitive sentence structures, unnatural uniformity, low lexical diversity, predictable rhythm. Score 0 = strong AI watermark signatures, 100 = natural human writing patterns.

4. WRITING STYLE SCORE (0-100): Measure lexical diversity (unique word ratio) and entropy (information density). Human writing shows higher variance. Score 0 = low diversity/entropy (AI-like), 100 = high diversity/entropy (human-like).

5. STYLE SIGNATURE FINGERPRINT: Compute a unique stylistic fingerprint based on:
- "sentenceRhythm": <number 0-100> - Consistency of sentence lengths and cadence (0 = highly uniform/robotic, 100 = naturally varied)
- "punctuationFrequency": <number 0-100> - Diversity in punctuation usage (0 = minimal/repetitive, 100 = rich variety)
- "vocabularySpread": <number 0-100> - Range of vocabulary used (0 = limited/repetitive words, 100 = diverse vocabulary)
- "tokenTransitions": <number 0-100> - Naturalness of word-to-word transitions (0 = predictable/template-like, 100 = organic flow)
- "matchesAiPattern": <boolean> - true if the style matches typical AI-pattern clusters
- "patternDescription": <string> - If matchesAiPattern is true, explain which AI patterns were detected

6. CLAIM EXTRACTION: Extract 3-5 key factual claims from the text that can be verified. Return as an array of strings.

Also perform sentence-level analysis. Identify 3-7 suspicious sentences with their individual risk scores.

AI-ORIGIN PROBABILITY: Using zero-shot classification and entropy-based heuristics, estimate the probability that this text is AI-generated vs human-written. Consider all four detection scores, linguistic patterns, and stylistic markers. Return two values that sum to 100:
- "aiOriginProbability": <number 0-100> - likelihood text is AI-generated
- "humanOriginProbability": <number 0-100> - likelihood text is human-written

${headline ? 'HEADLINE CONSISTENCY CHECK: If a headline is provided, analyze semantic similarity between headline and body. Return "headlineConsistency" object with score (0-100) and explanation.' : ''}

Return ONLY a JSON object in this exact format:
{
  "perplexityScore": <number 0-100>,
  "semanticScore": <number 0-100>,
  "watermarkScore": <number 0-100>,
  "writingStyleScore": <number 0-100>,
  "aiOriginProbability": <number 0-100>,
  "humanOriginProbability": <number 0-100>,
  "styleSignature": {
    "sentenceRhythm": <number 0-100>,
    "punctuationFrequency": <number 0-100>,
    "vocabularySpread": <number 0-100>,
    "tokenTransitions": <number 0-100>,
    "matchesAiPattern": <boolean>,
    "patternDescription": "<string or null>"
  },
  "extractedClaims": ["claim1", "claim2", "claim3"],
  "suspiciousSentences": [
    {"text": "sentence1", "riskScore": <number 0-100>},
    {"text": "sentence2", "riskScore": <number 0-100>}
  ],
  "explanation": "<3-4 sentence summary mentioning: repetition patterns (with examples), unnatural phrasing (specific), incoherent transitions (specific), logical contradictions (specific)>"${headline ? ',\n  "headlineConsistency": {"score": <number 0-100>, "explanation": "..."}' : ''}
}

Risk Score Guidelines:
- 0-40: Safe (green) - Natural human writing patterns
- 41-70: Medium risk (yellow) - Some concerning indicators
- 71-100: High risk (red) - Strong AI/manipulation signals

Be strict in your analysis. Most AI-generated content should score below 35 on perplexity and watermark scores.${headlinePrompt}`
          },
          {
            role: 'user',
            content: `Analyze this text for AI-generated fake news:\n\n${analysisText}`
          }
        ],
        temperature: 0.3,
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
      if (typeof analysisResult.perplexityScore !== 'number' ||
          typeof analysisResult.semanticScore !== 'number' ||
          typeof analysisResult.watermarkScore !== 'number' ||
          typeof analysisResult.writingStyleScore !== 'number' ||
          typeof analysisResult.aiOriginProbability !== 'number' ||
          typeof analysisResult.humanOriginProbability !== 'number') {
        throw new Error('Missing required score fields');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      console.error('Parse error:', parseError);
      throw new Error('Invalid response format from AI');
    }

    // Calculate overall FakeSense score (weighted average of 4 detection modules)
    const overallScore = Math.round(
      (analysisResult.perplexityScore * 0.25) +
      (analysisResult.semanticScore * 0.25) +
      (analysisResult.watermarkScore * 0.25) +
      (analysisResult.writingStyleScore * 0.25)
    );

    const finalResult = {
      overallScore,
      perplexityScore: analysisResult.perplexityScore,
      semanticScore: analysisResult.semanticScore,
      watermarkScore: analysisResult.watermarkScore,
      writingStyleScore: analysisResult.writingStyleScore,
      aiOriginProbability: analysisResult.aiOriginProbability,
      humanOriginProbability: analysisResult.humanOriginProbability,
      styleSignature: analysisResult.styleSignature || null,
      extractedClaims: analysisResult.extractedClaims || [],
      suspiciousSentences: analysisResult.suspiciousSentences || [],
      explanation: analysisResult.explanation || 'Multi-signal analysis complete.',
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
