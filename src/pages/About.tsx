import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Shield, Brain, Search, CheckCircle2 } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-primary">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold">About FakeSense</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Advanced AI detection system for identifying fake news and manipulated content
          </p>
        </div>

        <div className="space-y-8">
          <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In an era where AI-generated content is becoming increasingly sophisticated,
              FakeSense provides a crucial defense against misinformation. Our mission is
              to empower readers with the tools to verify content authenticity and make
              informed decisions about the information they consume.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We combine multiple detection algorithms to analyze text from various angles,
              providing a comprehensive assessment of content authenticity.
            </p>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/30 backdrop-blur border-border/30">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Perplexity Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Analyzes text patterns and predictability using advanced language models
                to detect AI-generated content signatures.
              </p>
            </Card>

            <Card className="p-6 bg-card/30 backdrop-blur border-border/30">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Semantic Consistency</h3>
              <p className="text-sm text-muted-foreground">
                Evaluates logical flow and coherence between different sections of the
                article to identify inconsistencies.
              </p>
            </Card>

            <Card className="p-6 bg-card/30 backdrop-blur border-border/30">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Watermark Detection</h3>
              <p className="text-sm text-muted-foreground">
                Identifies neural fingerprints, repetition patterns, and unnatural
                sentence structures typical of AI-generated text.
              </p>
            </Card>

            <Card className="p-6 bg-card/30 backdrop-blur border-border/30">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Factual Verification</h3>
              <p className="text-sm text-muted-foreground">
                Cross-references claims with verified knowledge sources to detect
                factual contradictions and misinformation.
              </p>
            </Card>
          </div>

          <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Text Input</h4>
                  <p className="text-sm text-muted-foreground">
                    Paste your article text or upload a document for analysis
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Multi-Algorithm Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Four independent algorithms analyze different aspects of the content
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Score Calculation</h4>
                  <p className="text-sm text-muted-foreground">
                    Results are combined into an overall authenticity score
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Detailed Report</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive comprehensive results with highlighted suspicious content
                  </p>
                </div>
              </li>
            </ol>
          </Card>

          <Card className="p-8 bg-gradient-primary text-primary-foreground">
            <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
            <p className="leading-relaxed mb-4">
              FakeSense leverages state-of-the-art AI models and natural language processing
              techniques to deliver accurate detection results. Our system continuously learns
              and adapts to new AI generation patterns.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Advanced language model analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Semantic embedding comparison</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Statistical pattern recognition</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Real-time fact verification</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;
