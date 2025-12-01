import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

interface SuspiciousSentenceProps {
  text: string;
  riskScore: number;
}

export const SuspiciousSentence = ({ text, riskScore }: SuspiciousSentenceProps) => {
  const getRiskLevel = () => {
    if (riskScore >= 71) return {
      level: "high",
      color: "bg-danger/10 border-danger/50",
      textColor: "text-danger",
      icon: <AlertTriangle className="w-4 h-4" />,
      label: "High Risk"
    };
    if (riskScore >= 41) return {
      level: "medium",
      color: "bg-warning/10 border-warning/50",
      textColor: "text-warning",
      icon: <AlertCircle className="w-4 h-4" />,
      label: "Medium Risk"
    };
    return {
      level: "low",
      color: "bg-success/10 border-success/50",
      textColor: "text-success",
      icon: <CheckCircle className="w-4 h-4" />,
      label: "Safe"
    };
  };

  const risk = getRiskLevel();

  return (
    <div className={cn("p-4 rounded-lg border transition-all", risk.color)}>
      <div className="flex items-start gap-3">
        <div className={cn("mt-1", risk.textColor)}>
          {risk.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className={cn("text-xs font-semibold uppercase tracking-wide", risk.textColor)}>
              {risk.label}
            </span>
            <span className={cn("text-sm font-bold", risk.textColor)}>
              {Math.round(riskScore)}%
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
};
