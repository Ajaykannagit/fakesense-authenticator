import { Card } from "@/components/ui/card";
import { Bot, User } from "lucide-react";

interface AiOriginChartProps {
  aiOriginProbability: number;
  humanOriginProbability: number;
}

export const AiOriginChart = ({ aiOriginProbability, humanOriginProbability }: AiOriginChartProps) => {
  return (
    <Card className="glass-card glass-card-hover p-6 animate-fade-in" style={{ animationDelay: '0.25s' }}>
      <h2 className="text-xl font-semibold mb-6 text-foreground">AI-Origin Probability</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Likelihood estimation using zero-shot classification and entropy-based heuristics
      </p>
      
      <div className="space-y-6">
        {/* AI-Generated Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-danger" />
              <span className="text-sm font-medium text-foreground">AI-Generated</span>
            </div>
            <span className={`text-2xl font-bold ${
              aiOriginProbability >= 70 ? 'text-danger' : 
              aiOriginProbability >= 40 ? 'text-warning' : 'text-success'
            }`}>
              {Math.round(aiOriginProbability)}%
            </span>
          </div>
          <div className="w-full h-8 bg-muted/20 rounded-full overflow-hidden border border-border/30">
            <div 
              className="h-full bg-gradient-to-r from-danger/80 to-danger transition-all duration-1000 ease-out flex items-center justify-end pr-3"
              style={{ width: `${aiOriginProbability}%` }}
            >
              {aiOriginProbability > 15 && (
                <span className="text-xs font-semibold text-white drop-shadow-md">
                  {Math.round(aiOriginProbability)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Human-Written Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-success" />
              <span className="text-sm font-medium text-foreground">Human-Written</span>
            </div>
            <span className={`text-2xl font-bold ${
              humanOriginProbability >= 70 ? 'text-success' : 
              humanOriginProbability >= 40 ? 'text-warning' : 'text-danger'
            }`}>
              {Math.round(humanOriginProbability)}%
            </span>
          </div>
          <div className="w-full h-8 bg-muted/20 rounded-full overflow-hidden border border-border/30">
            <div 
              className="h-full bg-gradient-to-r from-success/80 to-success transition-all duration-1000 ease-out flex items-center justify-end pr-3"
              style={{ width: `${humanOriginProbability}%` }}
            >
              {humanOriginProbability > 15 && (
                <span className="text-xs font-semibold text-white drop-shadow-md">
                  {Math.round(humanOriginProbability)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          Based on perplexity patterns, semantic analysis, watermark detection, and writing style metrics
        </p>
      </div>
    </Card>
  );
};
