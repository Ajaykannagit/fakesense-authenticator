import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";

interface Claim {
  text: string;
  status: "verified" | "suspicious" | "unverified";
  matchScore?: number;
  source?: string;
  explanation?: string;
}

interface FactCheckResult {
  factMatchScore: number;
  claims: Claim[];
  contradictions: string[];
}

interface FactCheckPanelProps {
  factCheck: FactCheckResult;
}

export const FactCheckPanel = ({ factCheck }: FactCheckPanelProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "suspicious":
        return <AlertCircle className="w-4 h-4 text-danger" />;
      default:
        return <HelpCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-success/20 text-success border-success/30">Verified</Badge>;
      case "suspicious":
        return <Badge className="bg-danger/20 text-danger border-danger/30">Suspicious</Badge>;
      default:
        return <Badge variant="outline">Unverified</Badge>;
    }
  };

  return (
    <Card className="glass-card p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.35s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-accent/10 text-accent">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Fact Check Analysis</h3>
            <p className="text-sm text-muted-foreground">Claims verified against public knowledge sources</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Fact Match Score</p>
          <p className={`text-2xl font-bold ${
            factCheck.factMatchScore >= 70 ? 'text-success' : 
            factCheck.factMatchScore >= 40 ? 'text-warning' : 'text-danger'
          }`}>
            {Math.round(factCheck.factMatchScore)}%
          </p>
        </div>
      </div>

      {/* Detected Claims */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">Detected Claims</h4>
        <ScrollArea className="h-[250px] pr-4">
          <div className="space-y-3">
            {factCheck.claims.map((claim, index) => (
              <div 
                key={index} 
                className="p-4 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(claim.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-sm text-foreground font-medium flex-1">
                        "{claim.text}"
                      </p>
                      {getStatusBadge(claim.status)}
                    </div>
                    {claim.explanation && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {claim.explanation}
                      </p>
                    )}
                    {claim.source && (
                      <p className="text-xs text-primary mt-1">
                        Source: {claim.source}
                      </p>
                    )}
                    {claim.matchScore !== undefined && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                claim.matchScore >= 70 ? 'bg-success' : 
                                claim.matchScore >= 40 ? 'bg-warning' : 'bg-danger'
                              }`}
                              style={{ width: `${claim.matchScore}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{Math.round(claim.matchScore)}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Contradictions */}
      {factCheck.contradictions && factCheck.contradictions.length > 0 && (
        <div className="p-4 rounded-lg bg-danger/10 border border-danger/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-danger" />
            <h4 className="text-sm font-semibold text-danger">Suspected Contradictions</h4>
          </div>
          <ul className="space-y-2">
            {factCheck.contradictions.map((contradiction, index) => (
              <li key={index} className="text-sm text-muted-foreground pl-4 border-l-2 border-danger/50">
                {contradiction}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
