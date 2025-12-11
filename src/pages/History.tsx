import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, ArrowLeft, Trash2, FileText } from "lucide-react";
import { NavLink } from "@/components/NavLink";

interface HistoryItem {
  id: string;
  score: number;
  date: string;
  headline?: string;
  textExtract: string;
  fullData: any;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("nexo-history");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      } catch (e) {
        console.error("Failed to parse history:", e);
      }
    }
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem("nexo-history");
    setHistory([]);
  };

  const handleViewAnalysis = (item: HistoryItem) => {
    navigate("/results", { state: item.fullData });
  };

  const handleDeleteItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("nexo-history", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <NavLink to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </NavLink>
            <div className="flex items-center gap-3">
              <History className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Analysis History
              </h1>
            </div>
          </div>
          {history.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearHistory}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <Card className="glass-card p-12 text-center animate-scale-in">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Analysis History</h2>
            <p className="text-muted-foreground mb-6">
              Your analyzed articles will appear here
            </p>
            <NavLink to="/">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </NavLink>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <Card
                key={item.id}
                className="glass-card glass-card-hover p-6 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleViewAnalysis(item)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    {item.headline && (
                      <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                        {item.headline}
                      </h3>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.textExtract}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                      <span>{new Date(item.date).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`text-3xl font-bold ${
                        item.score >= 70
                          ? "text-success"
                          : item.score >= 40
                          ? "text-warning"
                          : "text-danger"
                      }`}
                    >
                      {Math.round(item.score)}%
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
