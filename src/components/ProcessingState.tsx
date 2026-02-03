import { useEffect, useState } from "react";
import { Shield, Scan, Brain, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessingStateProps {
  progress?: number;
  currentStep?: string;
}

const steps = [
  { icon: Scan, label: "Extracting frames" },
  { icon: Brain, label: "Sending to AI for analysis" },
  { icon: Shield, label: "Processing results" },
  { icon: CheckCircle2, label: "Analysis complete" },
];

export const ProcessingState = ({ progress = 0, currentStep = "" }: ProcessingStateProps) => {
  // Determine which step is active based on progress
  const getActiveStep = () => {
    if (progress < 30) return 0;
    if (progress < 80) return 1;
    if (progress < 100) return 2;
    return 3;
  };

  const activeStepIndex = getActiveStep();

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
            className="h-full bg-gradient-to-r from-primary to-[hsl(199,89%,48%)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {currentStep || `${Math.round(progress)}% complete`}
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeStepIndex;
          const isComplete = index < activeStepIndex;

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
