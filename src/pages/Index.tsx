import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, Sparkles, Shield, Info, History, Brain, Fingerprint, FileText, TrendingUp, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AnalyzingOverlay } from "@/components/AnalyzingOverlay";
import { withRetry, getErrorMessage, isNetworkError } from "@/lib/retry";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const MAX_TEXT_LENGTH = 50000;

const features = [
  { 
    title: "Perplexity Analysis", 
    desc: "AI text pattern detection",
    icon: Brain,
    tooltip: "Measures how predictable the text is. AI-generated text often has lower perplexity due to its statistical patterns."
  },
  { 
    title: "Semantic Check", 
    desc: "Consistency verification",
    icon: TrendingUp,
    tooltip: "Analyzes logical flow and topic coherence. Detects unnatural topic shifts common in AI content."
  },
  { 
    title: "Watermark Detection", 
    desc: "AI fingerprint analysis",
    icon: Fingerprint,
    tooltip: "Identifies hidden patterns and statistical signatures left by AI text generators."
  },
  { 
    title: "Fact Verification", 
    desc: "Cross-reference checking",
    icon: FileText,
    tooltip: "Extracts claims and verifies them against trusted sources like Wikipedia."
  }
];

const Index = () => {
  const [headline, setHeadline] = useState("");
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    toast.loading("Processing file...", { id: "file-upload" });

    try {
      let extractedText = "";

      if (fileName.endsWith('.pdf')) {
        // Extract PDF text
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const textParts: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          textParts.push(pageText);
        }

        extractedText = textParts.join('\n\n');
      } else if (fileName.endsWith('.docx')) {
        // Extract Word document text
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      } else if (fileName.endsWith('.txt') || fileName.endsWith('.md') || fileName.endsWith('.rtf')) {
        // Read text files directly
        extractedText = await file.text();
      } else {
        // Try to read as text anyway
        extractedText = await file.text();
      }

      if (!extractedText.trim()) {
        toast.error("File appears to be empty", { id: "file-upload" });
        return;
      }

      if (extractedText.length > MAX_TEXT_LENGTH) {
        toast.warning(
          `Text is very long (${extractedText.length.toLocaleString()} chars). Using first ${MAX_TEXT_LENGTH.toLocaleString()} characters.`,
          { id: "file-upload", duration: 5000 }
        );
        extractedText = extractedText.substring(0, MAX_TEXT_LENGTH);
      }

      setText(extractedText);
      toast.success("File loaded successfully", { id: "file-upload" });
    } catch (error) {
      console.error("File extraction error:", error);
      toast.error(
        "Failed to extract text from file. Please copy and paste the text manually.",
        { id: "file-upload", duration: 5000 }
      );
    }
  };

  const handleAnalyze = useCallback(async () => {
    // Validation
    if (!text.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }

    if (text.length < 50) {
      toast.error("Text is too short. Please provide at least 50 characters for analysis.");
      return;
    }

    if (text.length > MAX_TEXT_LENGTH) {
      toast.warning(
        `Text is very long (${text.length.toLocaleString()} chars). Using first ${MAX_TEXT_LENGTH.toLocaleString()} characters.`,
        { duration: 5000 }
      );
    }

    setIsAnalyzing(true);
    const textToAnalyze = text.length > MAX_TEXT_LENGTH 
      ? text.substring(0, MAX_TEXT_LENGTH)
      : text;

    try {
      const data = await withRetry(
        async () => {
          const { data, error } = await supabase.functions.invoke('analyze-news', {
            body: { text: textToAnalyze, headline: headline.trim() || null }
          });

          if (error) throw error;
          if (!data) throw new Error("No data received from analysis");
          return data;
        },
        {
          maxAttempts: 3,
          delayMs: 1500,
          onRetry: (attempt, error) => {
            console.log(`Retry attempt ${attempt}:`, error.message);
            if (isNetworkError(error)) {
              toast.loading(`Connection issue. Retrying... (${attempt}/3)`, { id: "analyze-retry" });
            }
          }
        }
      );

      toast.dismiss("analyze-retry");
      navigate('/results', { 
        state: { 
          results: data, 
          originalText: textToAnalyze, 
          headline: headline.trim() || null 
        } 
      });
    } catch (error) {
      toast.dismiss("analyze-retry");
      console.error('Analysis error:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage, {
        action: {
          label: "Retry",
          onClick: () => handleAnalyze()
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, headline, navigate]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Analyzing Overlay */}
      <AnalyzingOverlay isVisible={isAnalyzing} />

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(263 70% 60% / 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(187 85% 55% / 0.1) 0%, transparent 50%)'
      }} />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-xl bg-background/50 animate-fade-in-down">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.reload()}>
              <div className="p-2 rounded-lg bg-gradient-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-glow-pulse">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Nexo
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/history')} className="hover:scale-105 transition-transform">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/about')} className="hover:scale-105 transition-transform">
                <Info className="w-4 h-4 mr-2" />
                About
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-pop-in">
              <Sparkles className="w-4 h-4 animate-bounce-subtle" />
              AI-Powered Detection
            </div>
            <h2 className="text-5xl font-bold tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Detect AI-Generated
              <br />
              <span className="bg-gradient-cyber bg-clip-text text-transparent animate-gradient-shift inline-block">
                Fake News
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>
              Advanced neural network analysis to identify AI-generated content,
              manipulated articles, and semantic inconsistencies.
            </p>
          </div>

          <Card className="p-8 bg-card/50 backdrop-blur-xl border-border/50 shadow-glow animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s' }}>
            <div className="space-y-6">
              <div className="animate-slide-in-left opacity-0" style={{ animationDelay: '0.4s' }}>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Headline (optional)
                </label>
                <Textarea
                  placeholder="Enter the article headline for consistency checking..."
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="min-h-[60px] bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300 focus:shadow-glow"
                />
              </div>
              
              <div className="animate-slide-in-left opacity-0" style={{ animationDelay: '0.5s' }}>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Article text
                </label>
                <Textarea
                  placeholder="Enter the news article text you want to analyze..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300 focus:shadow-glow"
                />
              </div>

              <div className="flex items-center gap-4 animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}>
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-sm text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              <div className="animate-slide-in-right opacity-0" style={{ animationDelay: '0.7s' }}>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="upload-zone border-2 border-dashed border-border/50 rounded-lg p-8 text-center group">
                    <Upload className="upload-icon w-8 h-8 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      Upload a file
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports PDF, Word (.docx), and text files (.txt, .md, .rtf)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt,.md,.rtf,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!text.trim() || isAnalyzing}
                className="btn-ripple w-full bg-gradient-primary hover:opacity-90 hover:scale-[1.02] text-primary-foreground font-semibold py-6 text-lg shadow-glow transition-all duration-300 animate-fade-in-up opacity-0 hover:shadow-[0_0_60px_hsl(263_70%_60%_/_0.4)]"
                style={{ animationDelay: '0.8s' }}
              >
                <Shield className="w-5 h-5 mr-2" />
                Analyze News
              </Button>
            </div>
          </Card>

          {/* Features Grid */}
          <TooltipProvider delayDuration={200}>
            <div className="grid md:grid-cols-4 gap-6 mt-16">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <Card 
                        className="feature-card p-6 bg-card/30 backdrop-blur border-border/30 text-center cursor-default animate-fade-in-up opacity-0"
                        style={{ animationDelay: `${0.9 + i * 0.1}s` }}
                      >
                        <div className="feature-icon w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground">{feature.desc}</p>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs text-sm animate-pop-in">
                      {feature.tooltip}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        </main>
      </div>
    </div>
  );
};

export default Index;
