import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info, BookOpen } from "lucide-react";

interface DeepExplanationProps {
  explanation: {
    summary: string;
    perplexityAnalysis: string;
    semanticDriftAnalysis: string;
    repetitionAnalysis: string;
    factualAnalysis: string;
    stylisticAnalysis: string;
    conclusion: string;
  };
  scores: {
    perplexityScore: number;
    semanticScore: number;
    watermarkScore: number;
    writingStyleScore: number;
    overallScore: number;
  };
}

const getScoreIcon = (score: number) => {
  if (score >= 70) return <CheckCircle className="w-4 h-4 text-success" />;
  if (score >= 40) return <Info className="w-4 h-4 text-warning" />;
  return <AlertTriangle className="w-4 h-4 text-danger" />;
};

const getScoreColor = (score: number) => {
  if (score >= 70) return "text-success";
  if (score >= 40) return "text-warning";
  return "text-danger";
};

export const DeepExplanationPanel = ({ explanation, scores }: DeepExplanationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    {
      title: "Low Perplexity Detection",
      content: explanation.perplexityAnalysis,
      score: scores.perplexityScore,
      icon: "🧠",
    },
    {
      title: "Semantic Drift Analysis",
      content: explanation.semanticDriftAnalysis,
      score: scores.semanticScore,
      icon: "🌊",
    },
    {
      title: "Repetition Loops & Patterns",
      content: explanation.repetitionAnalysis,
      score: scores.watermarkScore,
      icon: "🔄",
    },
    {
      title: "Factual Consistency",
      content: explanation.factualAnalysis,
      score: null,
      icon: "📋",
    },
    {
      title: "Stylistic Anomalies",
      content: explanation.stylisticAnalysis,
      score: scores.writingStyleScore,
      icon: "✍️",
    },
  ];

  return (
    <Card className="glass-card p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.25s' }}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Deep Explanation</h3>
              <p className="text-sm text-muted-foreground">Comprehensive breakdown of detection signals</p>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {isOpen ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Expand
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-6 space-y-6">
          {/* Summary */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-foreground leading-relaxed">{explanation.summary}</p>
          </div>

          {/* Detection Sections */}
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg bg-card/50 border border-border/30 hover:border-border/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{section.icon}</span>
                    <h4 className="font-semibold text-foreground">{section.title}</h4>
                  </div>
                  {section.score !== null && (
                    <div className="flex items-center gap-2">
                      {getScoreIcon(section.score)}
                      <span className={`font-mono font-bold ${getScoreColor(section.score)}`}>
                        {Math.round(section.score)}%
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed pl-7">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Conclusion */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <span>🎯</span> Final Assessment
            </h4>
            <p className="text-muted-foreground leading-relaxed">{explanation.conclusion}</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
