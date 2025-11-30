import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  title: string;
  score: number;
  description: string;
  icon?: React.ReactNode;
}

export const ScoreCard = ({ title, score, description, icon }: ScoreCardProps) => {
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

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
      <div className="flex items-start gap-4">
        {icon && (
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <span className={cn("text-2xl font-bold", getScoreColor())}>
              {Math.round(score)}%
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all duration-1000 ease-out rounded-full", getBarColor())}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
};
