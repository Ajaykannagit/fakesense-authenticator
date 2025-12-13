import { useState, useEffect } from "react";
import { Shield, Brain, Fingerprint, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyzingOverlayProps {
  isVisible: boolean;
}

const steps = [
  { id: 1, label: "Parsing text content", icon: FileText },
  { id: 2, label: "Analyzing perplexity patterns", icon: Brain },
  { id: 3, label: "Detecting AI fingerprints", icon: Fingerprint },
  { id: 4, label: "Generating authenticity score", icon: Shield },
];

export const AnalyzingOverlay = ({ isVisible }: AnalyzingOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setCompletedSteps([]);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          setCompletedSteps((completed) => [...completed, prev]);
          return prev + 1;
        }
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md animate-fade-in">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative p-8 rounded-2xl glass-card max-w-md w-full mx-4 animate-scale-in">
        {/* Glowing orb animation */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-gradient-primary opacity-20 blur-3xl animate-pulse-glow" />
        
        <div className="relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4 animate-bounce-subtle">
              <Shield className="w-8 h-8 text-primary animate-glow-pulse" />
            </div>
            <h2 className="text-xl font-semibold text-foreground animate-fade-in-up">Analyzing Content</h2>
            <p className="text-sm text-muted-foreground mt-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>This may take a few moments...</p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(index);
              const isCurrent = currentStep === index;
              
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg transition-all duration-500",
                    isCompleted && "bg-success/10 animate-pop-in",
                    isCurrent && "bg-primary/10"
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500",
                      isCompleted && "bg-success text-success-foreground scale-110",
                      isCurrent && "bg-primary text-primary-foreground shadow-glow",
                      !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 animate-pop-in" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      isCompleted && "text-success",
                      isCurrent && "text-foreground",
                      !isCompleted && !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-6 h-1.5 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
