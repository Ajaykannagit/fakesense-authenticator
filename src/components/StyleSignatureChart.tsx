import { Card } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Fingerprint, AlertTriangle } from "lucide-react";

interface StyleSignature {
  sentenceRhythm: number;
  punctuationFrequency: number;
  vocabularySpread: number;
  tokenTransitions: number;
  matchesAiPattern: boolean;
  patternDescription?: string;
}

interface StyleSignatureChartProps {
  signature: StyleSignature;
}

export const StyleSignatureChart = ({ signature }: StyleSignatureChartProps) => {
  const chartData = [
    { metric: "Sentence Rhythm", value: signature.sentenceRhythm, fullMark: 100 },
    { metric: "Punctuation", value: signature.punctuationFrequency, fullMark: 100 },
    { metric: "Vocabulary", value: signature.vocabularySpread, fullMark: 100 },
    { metric: "Transitions", value: signature.tokenTransitions, fullMark: 100 },
  ];

  return (
    <Card className="glass-card p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.25s' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          <Fingerprint className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Style Signature Fingerprint</h3>
          <p className="text-sm text-muted-foreground">Unique stylistic analysis of the text</p>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            />
            <Radar
              name="Style"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Metric Details */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground">Sentence Rhythm</p>
          <p className="text-lg font-bold text-foreground">{Math.round(signature.sentenceRhythm)}%</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground">Punctuation Freq.</p>
          <p className="text-lg font-bold text-foreground">{Math.round(signature.punctuationFrequency)}%</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground">Vocabulary Spread</p>
          <p className="text-lg font-bold text-foreground">{Math.round(signature.vocabularySpread)}%</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground">Token Transitions</p>
          <p className="text-lg font-bold text-foreground">{Math.round(signature.tokenTransitions)}%</p>
        </div>
      </div>

      {/* AI Pattern Match Warning */}
      {signature.matchesAiPattern && (
        <div className="mt-4 p-4 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning">AI Pattern Detected</p>
            <p className="text-sm text-muted-foreground mt-1">
              {signature.patternDescription || "This text matches typical AI-pattern clusters."}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};
