import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Brain, AlertTriangle, History } from "lucide-react";

interface PatternMatch {
  similarity: number;
  matchedPatterns: string[];
  matchedArticleCount: number;
}

interface SelfLearningBadgeProps {
  patternMatch: PatternMatch | null;
}

export const SelfLearningBadge = ({ patternMatch }: SelfLearningBadgeProps) => {
  if (!patternMatch || patternMatch.similarity < 50) {
    return null;
  }

  const isHighMatch = patternMatch.similarity >= 70;

  return (
    <Card className={`p-4 mb-8 animate-fade-in border ${
      isHighMatch 
        ? 'bg-danger/10 border-danger/30' 
        : 'bg-warning/10 border-warning/30'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isHighMatch ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'}`}>
          <Brain className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`text-sm font-semibold ${isHighMatch ? 'text-danger' : 'text-warning'}`}>
              Pattern Match Detected
            </h4>
            <Badge variant="outline" className={isHighMatch ? 'border-danger/50 text-danger' : 'border-warning/50 text-warning'}>
              {Math.round(patternMatch.similarity)}% Similar
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            This text matches patterns seen in {patternMatch.matchedArticleCount} earlier {isHighMatch ? 'suspicious' : 'analyzed'} article{patternMatch.matchedArticleCount > 1 ? 's' : ''}.
          </p>
          {patternMatch.matchedPatterns.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {patternMatch.matchedPatterns.map((pattern, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {pattern}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <AlertTriangle className={`w-5 h-5 shrink-0 ${isHighMatch ? 'text-danger' : 'text-warning'}`} />
      </div>
    </Card>
  );
};
