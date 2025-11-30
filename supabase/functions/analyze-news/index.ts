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
    const { text } = await req.json();
    
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
            content: `You are FakeSense, an expert AI system for detecting AI-generated fake news and manipulated content. 

Your task is to analyze the provided text and return four specific detection scores (0-100):

1. PERPLEXITY SCORE (0-100): Analyze text predictability patterns. AI-generated text typically has lower perplexity (more predictable). Score 0 = definitely AI-generated, 100 = definitely human-written.

2. SEMANTIC CONSISTENCY SCORE (0-100): Check logical flow and coherence between sections. Manipulated content often has semantic breaks. Score 0 = highly inconsistent, 100 = perfectly consistent.

3. WATERMARK SCORE (0-100): Identify neural fingerprints like repetitive patterns, unnatural uniformity, low lexical diversity. Score 0 = strong AI signatures, 100 = natural human writing.

4. FACTUAL VERIFICATION SCORE (0-100): Cross-check claims for contradictions and implausible statements. Score 0 = many factual issues, 100 = factually sound.

Also identify 2-5 suspicious sentences that exhibit concerning patterns.

Return ONLY a JSON object in this exact format:
{
  "perplexityScore": <number 0-100>,
  "semanticScore": <number 0-100>,
  "watermarkScore": <number 0-100>,
  "factualScore": <number 0-100>,
  "suspiciousSentences": ["sentence1", "sentence2", ...],
  "explanation": "<brief 2-3 sentence summary of findings>"
}

Be strict in your analysis. Most AI-generated content should score below 40 on perplexity and watermark scores.`
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
          typeof analysisResult.factualScore !== 'number') {
        throw new Error('Missing required score fields');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      console.error('Parse error:', parseError);
      throw new Error('Invalid response format from AI');
    }

    // Calculate overall score (weighted average)
    const overallScore = Math.round(
      (analysisResult.perplexityScore * 0.25) +
      (analysisResult.semanticScore * 0.25) +
      (analysisResult.watermarkScore * 0.25) +
      (analysisResult.factualScore * 0.25)
    );

    const finalResult = {
      overallScore,
      perplexityScore: analysisResult.perplexityScore,
      semanticScore: analysisResult.semanticScore,
      watermarkScore: analysisResult.watermarkScore,
      factualScore: analysisResult.factualScore,
      suspiciousSentences: analysisResult.suspiciousSentences || [],
      explanation: analysisResult.explanation || 'Analysis complete.'
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
