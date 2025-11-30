import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, Sparkles, Shield, Info } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      toast.error("Currently only .txt files are supported. PDF support coming soon!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content.trim()) {
        setText(content);
        toast.success("File loaded successfully");
      } else {
        toast.error("File appears to be empty");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-news', {
        body: { text }
      });

      if (error) throw error;

      navigate('/results', { state: { results: data, originalText: text } });
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Failed to analyze text. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(263 70% 60% / 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(187 85% 55% / 0.1) 0%, transparent 50%)'
      }} />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-xl bg-background/50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                FakeSense
              </h1>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/about')}>
              <Info className="w-4 h-4 mr-2" />
              About
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Detection
            </div>
            <h2 className="text-5xl font-bold tracking-tight">
              Detect AI-Generated
              <br />
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                Fake News
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced neural network analysis to identify AI-generated content,
              manipulated articles, and semantic inconsistencies.
            </p>
          </div>

          <Card className="p-8 bg-card/50 backdrop-blur-xl border-border/50 shadow-glow">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Paste news article or text
                </label>
                <Textarea
                  placeholder="Enter the news article text you want to analyze..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] bg-background/50 border-border/50 focus:border-primary/50"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-sm text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              <div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">
                      Upload a file
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports .txt files
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!text.trim() || isAnalyzing}
                className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-6 text-lg shadow-glow"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Analyze News
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-4 gap-6 mt-16">
            {[
              { title: "Perplexity Analysis", desc: "AI text pattern detection" },
              { title: "Semantic Check", desc: "Consistency verification" },
              { title: "Watermark Detection", desc: "AI fingerprint analysis" },
              { title: "Fact Verification", desc: "Cross-reference checking" }
            ].map((feature, i) => (
              <Card key={i} className="p-6 bg-card/30 backdrop-blur border-border/30 text-center hover:bg-card/50 transition-all">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
