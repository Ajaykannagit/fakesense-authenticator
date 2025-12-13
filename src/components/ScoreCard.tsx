import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface ScoreCardProps {
  title: string;
  score: number;
  description: string;
  icon?: React.ReactNode;
  tooltip?: string;
}

const defaultTooltips: Record<string, string> = {
  "Perplexity Score": "Lower perplexity indicates more predictable, potentially AI-generated text. Higher scores suggest more human-like variability.",
  "Semantic Score": "Measures logical flow and consistency. Low scores indicate topic drift or incoherent transitions typical of AI content.",
  "Watermark Score": "Detects hidden patterns left by AI text generators. Low scores suggest presence of AI fingerprints.",
  "Writing Style Score": "Analyzes vocabulary diversity and sentence structure. AI tends to produce more uniform, repetitive patterns.",
};

export const ScoreCard = ({ title, score, description, icon, tooltip }: ScoreCardProps) => {
  const getScoreColor = () => {
    if (score >= 70) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-danger";
  };

  const getBarColor = () => {
    if (score >= 70) return "bg-success";
    if (score >= 40) return "bg-warning";
    return "bg-danger";
  };

  const tooltipText = tooltip || defaultTooltips[title] || description;

  return (
    <Card className="glass-card glass-card-hover p-6 group relative overflow-hidden">
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-start gap-4 relative z-10">
        {icon && (
          <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-glow">
            {icon}
          </div>
        )}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{title}</h3>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-sm animate-pop-in">
                    {tooltipText}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className={cn("text-2xl font-bold tabular-nums transition-all duration-500", getScoreColor())}>
              {Math.round(score)}%
            </span>
          </div>
          <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all duration-1000 ease-out rounded-full relative", getBarColor())}
              style={{ width: `${score}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
};
