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
      <div className="relative p-8 rounded-2xl glass-card max-w-md w-full mx-4">
        {/* Glowing orb animation */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-gradient-primary opacity-20 blur-3xl animate-pulse" />
        
        <div className="relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <Shield className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Analyzing Content</h2>
            <p className="text-sm text-muted-foreground mt-1">This may take a few moments...</p>
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
                    isCompleted && "bg-success/10",
                    isCurrent && "bg-primary/10"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500",
                      isCompleted && "bg-success text-success-foreground",
                      isCurrent && "bg-primary text-primary-foreground",
                      !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
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
              className="h-full bg-gradient-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
