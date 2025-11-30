import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScoreRing } from "@/components/ScoreRing";
import { ScoreCard } from "@/components/ScoreCard";
import { ArrowLeft, AlertTriangle, CheckCircle2, Info, Brain } from "lucide-react";
import { useEffect } from "react";

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

  const { overallScore, perplexityScore, semanticScore, watermarkScore, factualScore, suspiciousSentences, explanation } = results;

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
            title="Perplexity Analysis"
            score={perplexityScore}
            description="Measures text predictability patterns typical of AI-generated content"
            icon={<Brain className="w-5 h-5" />}
          />
          <ScoreCard
            title="Semantic Consistency"
            score={semanticScore}
            description="Evaluates logical flow and coherence between article sections"
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
          <ScoreCard
            title="Watermark Detection"
            score={watermarkScore}
            description="Identifies neural fingerprints and repetition patterns"
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <ScoreCard
            title="Factual Verification"
            score={factualScore}
            description="Cross-references claims against verified knowledge sources"
            icon={<Info className="w-5 h-5" />}
          />
        </div>

        {/* Explanation */}
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Analysis Summary
          </h2>
          <p className="text-muted-foreground leading-relaxed">{explanation}</p>
        </Card>

        {/* Suspicious Sentences */}
        {suspiciousSentences && suspiciousSentences.length > 0 && (
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Flagged Content
            </h2>
            <div className="space-y-4">
              {suspiciousSentences.map((sentence: string, index: number) => (
                <div key={index} className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
                  <p className="text-sm text-foreground">{sentence}</p>
                </div>
              ))}
            </div>
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
