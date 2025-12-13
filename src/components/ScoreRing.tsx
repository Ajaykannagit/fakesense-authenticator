import { useEffect, useState } from "react";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export const ScoreRing = ({ score, size = 120, strokeWidth = 8 }: ScoreRingProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setDisplayScore(current);
        if (current >= score) {
          clearInterval(interval);
        }
      }, 15);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = () => {
    if (score >= 70) return "hsl(var(--success))";
    if (score >= 40) return "hsl(var(--warning))";
    return "hsl(var(--danger))";
  };

  const getRiskLevel = () => {
    if (score >= 70) return { text: "Low Risk", color: "text-success" };
    if (score >= 40) return { text: "Medium Risk", color: "text-warning" };
    return { text: "High Risk", color: "text-danger" };
  };

  const risk = getRiskLevel();

  return (
    <div className="flex flex-col items-center gap-4 animate-scale-in">
      <div className="relative group" style={{ width: size, height: size }}>
        {/* Animated glow ring */}
        <div 
          className="absolute inset-0 rounded-full opacity-30 blur-xl transition-opacity duration-500 group-hover:opacity-50"
          style={{ background: `radial-gradient(circle, ${getColor()} 0%, transparent 70%)` }}
        />
        
        <svg className="transform -rotate-90 relative z-10" width={size} height={size}>
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={getColor()} stopOpacity="1" />
              <stop offset="100%" stopColor={getColor()} stopOpacity="0.6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Background circle with subtle pulse */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            fill="none"
            opacity="0.2"
            className="animate-pulse-glow"
          />
          {/* Score progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            filter="url(#glow)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-4xl font-bold tabular-nums transition-all duration-300">{Math.round(displayScore)}%</span>
          <span className="text-xs text-muted-foreground tracking-wide">Authenticity</span>
        </div>
      </div>
      <div className={`text-sm font-semibold px-4 py-1.5 rounded-full ${risk.color} bg-current/10 animate-pop-in border border-current/20`}>
        {risk.text}
      </div>
    </div>
  );
};
