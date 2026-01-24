import { useEffect, useState } from "react";
import { Shield, Scan, Brain, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessingStateProps {
  onComplete: () => void;
}

const steps = [
  { icon: Scan, label: "Extracting frames", duration: 1500 },
  { icon: Brain, label: "Analyzing facial features", duration: 2000 },
  { icon: Shield, label: "Detecting manipulation", duration: 1500 },
  { icon: CheckCircle2, label: "Generating report", duration: 1000 },
];

export const ProcessingState = ({ onComplete }: ProcessingStateProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let stepIndex = 0;
    let progressInterval: ReturnType<typeof setInterval>;

    const runStep = () => {
      if (stepIndex >= steps.length) {
        setTimeout(onComplete, 500);
        return;
      }

      setCurrentStep(stepIndex);
      const stepDuration = steps[stepIndex].duration;
      const startProgress = (stepIndex / steps.length) * 100;
      const endProgress = ((stepIndex + 1) / steps.length) * 100;
      const increment = (endProgress - startProgress) / (stepDuration / 50);

      let currentProgress = startProgress;
      progressInterval = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= endProgress) {
          currentProgress = endProgress;
          clearInterval(progressInterval);
          stepIndex++;
          setTimeout(runStep, 200);
        }
        setProgress(currentProgress);
      }, 50);
    };

    runStep();

    return () => {
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="glass-card rounded-2xl p-8 max-w-lg mx-auto">
      {/* Scanning animation */}
      <div className="relative aspect-square max-w-[200px] mx-auto mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
        <div className="absolute inset-4 rounded-full border-2 border-primary/50" />
        <div className="absolute inset-8 rounded-full border-2 border-primary/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <Shield className="h-12 w-12 text-primary float" />
            <div className="absolute inset-0 rounded-full bg-primary/20 pulse-ring" />
          </div>
        </div>
        <div className="scan-line" />
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-[hsl(199,89%,48%)] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {Math.round(progress)}% complete
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isComplete = index < currentStep;

          return (
            <div
              key={step.label}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
                isActive && "bg-primary/10 border border-primary/30",
                isComplete && "opacity-60"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isActive ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground",
                  isComplete && "bg-success/20 text-success"
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className={cn("h-4 w-4", isActive && "animate-pulse")} />
                )}
              </div>
              <span className={cn(
                "text-sm",
                isActive ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
