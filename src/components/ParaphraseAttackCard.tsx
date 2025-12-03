import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface ParaphraseAttack {
  suspicionScore: number;
  embeddingVariance: number;
  synonymDensity: number;
  explanation: string;
}

interface ParaphraseAttackCardProps {
  attack: ParaphraseAttack;
}

export const ParaphraseAttackCard = ({ attack }: ParaphraseAttackCardProps) => {
  const isHighRisk = attack.suspicionScore >= 70;
  const isMediumRisk = attack.suspicionScore >= 40 && attack.suspicionScore < 70;

  const getIcon = () => {
    if (isHighRisk) return <AlertTriangle className="w-6 h-6" />;
    if (isMediumRisk) return <Shield className="w-6 h-6" />;
    return <CheckCircle className="w-6 h-6" />;
  };

  const getColor = () => {
    if (isHighRisk) return 'text-danger';
    if (isMediumRisk) return 'text-warning';
    return 'text-success';
  };

  const getBgColor = () => {
    if (isHighRisk) return 'bg-danger/10';
    if (isMediumRisk) return 'bg-warning/10';
    return 'bg-success/10';
  };

  return (
    <Card className="glass-card p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.28s' }}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${getBgColor()} ${getColor()}`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Paraphrase Attack Detection</h3>
              <p className="text-sm text-muted-foreground">Detects AI-assisted rewriting to evade detection</p>
            </div>
            <span className={`text-2xl font-bold ${getColor()}`}>
              {Math.round(attack.suspicionScore)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Suspicion Level</span>
              <span>{isHighRisk ? 'High Risk' : isMediumRisk ? 'Medium Risk' : 'Low Risk'}</span>
            </div>
            <Progress 
              value={attack.suspicionScore} 
              className={`h-2 ${isHighRisk ? '[&>div]:bg-danger' : isMediumRisk ? '[&>div]:bg-warning' : '[&>div]:bg-success'}`}
            />
          </div>

          {/* Detailed metrics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Embedding Variance</p>
              <div className="flex items-center gap-2">
                <Progress value={attack.embeddingVariance} className="flex-1 h-1.5" />
                <span className="text-sm font-medium">{Math.round(attack.embeddingVariance)}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {attack.embeddingVariance < 40 ? 'Unnaturally uniform' : attack.embeddingVariance > 70 ? 'Natural variation' : 'Moderate variation'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Synonym Density</p>
              <div className="flex items-center gap-2">
                <Progress value={attack.synonymDensity} className="flex-1 h-1.5" />
                <span className="text-sm font-medium">{Math.round(attack.synonymDensity)}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {attack.synonymDensity > 70 ? 'Excessive synonyms' : attack.synonymDensity > 40 ? 'Elevated usage' : 'Normal usage'}
              </p>
            </div>
          </div>

          {/* Explanation */}
          <p className="text-sm text-muted-foreground">{attack.explanation}</p>

          {isHighRisk && (
            <div className="mt-4 p-3 rounded-lg bg-danger/10 border border-danger/30">
              <p className="text-sm text-danger font-medium">
                High likelihood of AI-assisted paraphrasing detected. The text shows signs of systematic word replacement and sentence restructuring.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
