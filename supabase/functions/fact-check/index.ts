import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WikiSearchResult {
  title: string;
  snippet: string;
  pageid: number;
}

async function searchWikipedia(query: string): Promise<WikiSearchResult[]> {
  try {
    const url = new URL('https://en.wikipedia.org/w/api.php');
    url.searchParams.set('action', 'query');
    url.searchParams.set('list', 'search');
    url.searchParams.set('srsearch', query);
    url.searchParams.set('srlimit', '3');
    url.searchParams.set('format', 'json');
    url.searchParams.set('origin', '*');

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error('Wikipedia API error:', response.status);
      return [];
    }

    const data = await response.json();
    return data.query?.search || [];
  } catch (error) {
    console.error('Wikipedia search error:', error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { claims } = await req.json();

    if (!claims || !Array.isArray(claims)) {
      return new Response(
        JSON.stringify({ error: 'Claims array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fact-checking ${claims.length} claims`);

    const verifiedClaims = await Promise.all(
      claims.slice(0, 5).map(async (claim: string) => {
        const results = await searchWikipedia(claim);
        
        if (results.length === 0) {
          return {
            text: claim,
            status: 'unverified',
            matchScore: 0,
            explanation: 'No matching information found in public knowledge sources.'
          };
        }

        // Simple similarity check based on keyword overlap
        const claimWords = new Set(claim.toLowerCase().split(/\W+/).filter(w => w.length > 3));
        let bestMatch = { score: 0, source: '', snippet: '' };

        for (const result of results) {
          const snippetText = result.snippet.replace(/<[^>]*>/g, ''); // Remove HTML tags
          const snippetWords = new Set(snippetText.toLowerCase().split(/\W+/).filter(w => w.length > 3));
          
          // Calculate Jaccard similarity
          const intersection = [...claimWords].filter(w => snippetWords.has(w)).length;
          const union = new Set([...claimWords, ...snippetWords]).size;
          const similarity = union > 0 ? (intersection / union) * 100 : 0;

          if (similarity > bestMatch.score) {
            bestMatch = {
              score: similarity,
              source: result.title,
              snippet: snippetText
            };
          }
        }

        let status: 'verified' | 'suspicious' | 'unverified';
        if (bestMatch.score >= 40) {
          status = 'verified';
        } else if (bestMatch.score >= 20) {
          status = 'unverified';
        } else {
          status = 'suspicious';
        }

        return {
          text: claim,
          status,
          matchScore: Math.round(bestMatch.score * 2), // Scale up for better UX
          source: bestMatch.source || undefined,
          explanation: bestMatch.snippet 
            ? `Related info: "${bestMatch.snippet.substring(0, 150)}..."`
            : 'Limited information found.'
        };
      })
    );

    // Calculate overall fact match score
    const verifiedCount = verifiedClaims.filter(c => c.status === 'verified').length;
    const factMatchScore = claims.length > 0 
      ? Math.round((verifiedCount / claims.length) * 100)
      : 50;

    // Identify contradictions (claims marked as suspicious)
    const contradictions = verifiedClaims
      .filter(c => c.status === 'suspicious')
      .map(c => c.text);

    return new Response(
      JSON.stringify({
        factMatchScore,
        claims: verifiedClaims,
        contradictions
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Fact check error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Fact check failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
