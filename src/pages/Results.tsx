import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScoreRing } from "@/components/ScoreRing";
import { ScoreCard } from "@/components/ScoreCard";
import { SuspiciousSentence } from "@/components/SuspiciousSentence";
import { ArrowLeft, Brain, FileText, Fingerprint, TrendingUp, Download, ChevronDown, ChevronUp, Target } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, originalText, headline } = location.state || {};
  const [isExplanationOpen, setIsExplanationOpen] = useState(true);

  useEffect(() => {
    if (!results) {
      navigate('/');
    }
  }, [results, navigate]);

  if (!results) return null;

  const {
    overallScore,
    perplexityScore,
    semanticScore,
    watermarkScore,
    writingStyleScore,
    suspiciousSentences,
    explanation,
    headlineConsistency
  } = results;

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPos = 20;

      // Title
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("FakeSense Analysis Report", margin, yPos);
      yPos += 15;

      // Timestamp
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPos);
      yPos += 15;

      // Overall Score
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`Overall FakeSense Score: ${Math.round(overallScore)}%`, margin, yPos);
      yPos += 10;

      // Individual Scores
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Detection Scores:", margin, yPos);
      yPos += 8;
      doc.setFont("helvetica", "normal");
      doc.text(`Perplexity Score: ${Math.round(perplexityScore)}%`, margin + 5, yPos);
      yPos += 6;
      doc.text(`Semantic Score: ${Math.round(semanticScore)}%`, margin + 5, yPos);
      yPos += 6;
      doc.text(`Watermark Score: ${Math.round(watermarkScore)}%`, margin + 5, yPos);
      yPos += 6;
      doc.text(`Writing Style Score: ${Math.round(writingStyleScore)}%`, margin + 5, yPos);
      yPos += 10;

      // Headline Consistency
      if (headlineConsistency && headline) {
        doc.setFont("helvetica", "bold");
        doc.text(`Headline Consistency: ${Math.round(headlineConsistency.score)}%`, margin + 5, yPos);
        yPos += 6;
        doc.setFont("helvetica", "normal");
        const consistencyLines = doc.splitTextToSize(headlineConsistency.explanation, maxWidth - 5);
        doc.text(consistencyLines, margin + 5, yPos);
        yPos += consistencyLines.length * 6 + 4;
      }

      // Explanation
      doc.setFont("helvetica", "bold");
      doc.text("Analysis Explanation:", margin, yPos);
      yPos += 8;
      doc.setFont("helvetica", "normal");
      const explanationLines = doc.splitTextToSize(explanation, maxWidth);
      doc.text(explanationLines, margin, yPos);
      yPos += explanationLines.length * 6 + 10;

      // Suspicious Sentences
      if (suspiciousSentences && suspiciousSentences.length > 0) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.text("Suspicious Sentences:", margin, yPos);
        yPos += 8;
        
        suspiciousSentences.slice(0, 10).forEach((sentence: any, index: number) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.setFont("helvetica", "normal");
          doc.text(`${index + 1}. Risk: ${Math.round(sentence.riskScore)}%`, margin, yPos);
          yPos += 6;
          const sentenceLines = doc.splitTextToSize(sentence.text, maxWidth - 10);
          doc.text(sentenceLines, margin + 5, yPos);
          yPos += sentenceLines.length * 5 + 6;
        });
      }

      // Original Text Preview
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.text("Original Text Preview:", margin, yPos);
      yPos += 8;
      doc.setFont("helvetica", "normal");
      const textPreview = originalText.substring(0, 500) + (originalText.length > 500 ? "..." : "");
      const textLines = doc.splitTextToSize(textPreview, maxWidth);
      doc.text(textLines, margin, yPos);

      // Save PDF
      doc.save(`FakeSense_Report_${Date.now()}.pdf`);
      toast.success("PDF report downloaded successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF report");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            New Analysis
          </Button>
          <Button
            onClick={handleExportPDF}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
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
            description="Measures text predictability patterns"
            icon={<Brain />}
          />
          <ScoreCard
            title="Semantic Score"
            score={semanticScore}
            description="Detects semantic drift and inconsistencies"
            icon={<TrendingUp />}
          />
          <ScoreCard
            title="Watermark Score"
            score={watermarkScore}
            description="Identifies AI-generated fingerprints"
            icon={<Fingerprint />}
          />
          <ScoreCard
            title="Writing Style Score"
            score={writingStyleScore}
            description="Analyzes lexical diversity and patterns"
            icon={<FileText />}
          />
        </div>

        {/* Headline Consistency */}
        {headlineConsistency && headline && (
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/10 text-accent">
                <Target className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-foreground">Headline Consistency</h3>
                  <span className={`text-2xl font-bold ${
                    headlineConsistency.score >= 70 ? 'text-success' : 
                    headlineConsistency.score >= 40 ? 'text-warning' : 'text-danger'
                  }`}>
                    {Math.round(headlineConsistency.score)}%
                  </span>
                </div>
                <p className="text-muted-foreground mb-2 text-sm italic">"{headline}"</p>
                <p className="text-muted-foreground">{headlineConsistency.explanation}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Explanation Panel */}
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50 mb-8">
          <Collapsible open={isExplanationOpen} onOpenChange={setIsExplanationOpen}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Detailed Analysis Explanation</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isExplanationOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-4">
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>{explanation}</p>
                <div className="pt-3 border-t border-border/50">
                  <p className="text-sm font-medium text-foreground mb-2">Key Detection Indicators:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Repetition patterns and phrase frequency</li>
                    <li>Unnatural or overly formal phrasing</li>
                    <li>Incoherent topic transitions</li>
                    <li>Logical contradictions in statements</li>
                  </ul>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Suspicious Sentences with Color Coding */}
        {suspiciousSentences && suspiciousSentences.length > 0 && (
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50 mb-8">
            <h2 className="text-xl font-semibold mb-4">Sentence-Level Risk Analysis</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Individual sentences analyzed for linguistic anomalies and suspicious patterns.
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
