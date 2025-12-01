import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScoreRing } from "@/components/ScoreRing";
import { ScoreCard } from "@/components/ScoreCard";
import { SuspiciousSentence } from "@/components/SuspiciousSentence";
import { ArrowLeft, AlertTriangle, CheckCircle2, Activity, Brain, Fingerprint } from "lucide-react";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, originalText } = location.state || {};

  useEffect(() => {
    if (!results) {
      navigate('/');
    }
  }, [results, navigate]);

  if (!results) return null;

  const { overallScore, perplexityScore, semanticScore, watermarkScore, writingStyleScore, suspiciousSentences, explanation } = results;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            New Analysis
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Overall Score Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-6">Analysis Results</h1>
          <Card className="inline-block p-8 bg-card/50 backdrop-blur-xl border-border/50 shadow-glow">
            <ScoreRing score={overallScore} size={160} strokeWidth={12} />
            <p className="text-sm text-muted-foreground mt-4 max-w-md">
              FakeSense Score combines four detection algorithms to assess content authenticity
            </p>
          </Card>
        </div>

        {/* Detection Scores Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <ScoreCard
            title="Perplexity Score"
            score={perplexityScore}
            description="GPT-2 model analysis of text predictability and token patterns"
            icon={<Brain className="w-5 h-5" />}
          />
          <ScoreCard
            title="Semantic Drift Score"
            score={semanticScore}
            description="Sentence-embedding cosine similarity between consecutive sections"
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
          <ScoreCard
            title="Watermark Fingerprint"
            score={watermarkScore}
            description="Burstiness patterns and token repetition analysis"
            icon={<Fingerprint className="w-5 h-5" />}
          />
          <ScoreCard
            title="Writing Style Score"
            score={writingStyleScore}
            description="Lexical diversity and entropy measurement"
            icon={<Activity className="w-5 h-5" />}
          />
        </div>

        {/* Explanation */}
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Multi-Signal Analysis Summary
          </h2>
          <p className="text-muted-foreground leading-relaxed">{explanation}</p>
        </Card>

        {/* Suspicious Sentences with Color Coding */}
        {suspiciousSentences && suspiciousSentences.length > 0 && (
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Sentence-Level Risk Analysis
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              High-risk sentences show strong AI/manipulation signals. Medium-risk have some concerns. Safe sentences appear natural.
            </p>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {suspiciousSentences.map((sentence: any, index: number) => (
                  <SuspiciousSentence
                    key={index}
                    text={typeof sentence === 'string' ? sentence : sentence.text}
                    riskScore={typeof sentence === 'string' ? 50 : sentence.riskScore}
                  />
                ))}
              </div>
            </ScrollArea>
          </Card>
        )}

        {/* Original Text Preview */}
        <Card className="p-6 bg-card/30 backdrop-blur border-border/30 mt-8">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Original Text</h3>
          <p className="text-sm text-foreground/80 line-clamp-6">{originalText}</p>
        </Card>
      </main>
    </div>
  );
};

export default Results;
