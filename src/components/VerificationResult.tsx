import { CheckCircle2, XCircle, AlertTriangle, Shield, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VerificationResultProps {
  isAuthentic: boolean;
  confidence: number;
  onReset: () => void;
}

const generateReport = (isAuthentic: boolean, confidence: number, metrics: { label: string; score: number }[]) => {
  const report = {
    reportId: `VER-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    verdict: isAuthentic ? "AUTHENTIC" : "DEEPFAKE_DETECTED",
    confidenceScore: confidence,
    analysisDetails: metrics.map(m => ({
      metric: m.label,
      score: m.score,
      status: m.score >= 70 ? "PASS" : "FAIL"
    })),
    recommendation: isAuthentic 
      ? "Video appears authentic. Safe to proceed with verification."
      : "Video shows signs of manipulation. Do not proceed with KYC verification."
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `deepverify-report-${report.reportId}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const VerificationResult = ({ isAuthentic, confidence, onReset }: VerificationResultProps) => {
  const metrics = [
    { label: "Facial Consistency", score: isAuthentic ? 96 : 34 },
    { label: "Temporal Analysis", score: isAuthentic ? 94 : 28 },
    { label: "Lip Sync Detection", score: isAuthentic ? 98 : 42 },
    { label: "Artifact Detection", score: isAuthentic ? 99 : 18 },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Result Card */}
      <div
        className={cn(
          "glass-card rounded-2xl p-8 mb-6 border-2",
          isAuthentic ? "border-success/30" : "border-destructive/30"
        )}
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div
              className={cn(
                "p-4 rounded-full",
                isAuthentic ? "bg-success/10" : "bg-destructive/10"
              )}
            >
              {isAuthentic ? (
                <CheckCircle2 className="h-16 w-16 text-success" />
              ) : (
                <XCircle className="h-16 w-16 text-destructive" />
              )}
            </div>
            <div
              className={cn(
                "absolute inset-0 rounded-full pulse-ring",
                isAuthentic ? "bg-success/20" : "bg-destructive/20"
              )}
            />
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {isAuthentic ? "Video Verified" : "Deepfake Detected"}
          </h2>
          <p className="text-muted-foreground max-w-md">
            {isAuthentic
              ? "Our AI analysis confirms this video appears to be authentic with high confidence."
              : "Our AI analysis detected signs of manipulation in this video."}
          </p>
        </div>

        {/* Confidence Score */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Confidence Score</span>
            <span
              className={cn(
                "text-lg font-bold",
                isAuthentic ? "text-success" : "text-destructive"
              )}
            >
              {confidence}%
            </span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-1000 rounded-full",
                isAuthentic
                  ? "bg-gradient-to-r from-success to-success/70"
                  : "bg-gradient-to-r from-destructive to-destructive/70"
              )}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="p-4 rounded-xl bg-secondary/50 border border-border/50"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">{metric.label}</span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    metric.score >= 70 ? "text-success" : "text-destructive"
                  )}
                >
                  {metric.score}%
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    metric.score >= 70 ? "bg-success" : "bg-destructive"
                  )}
                  style={{ width: `${metric.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Notice (if deepfake) */}
      {!isAuthentic && (
        <div className="glass-card rounded-xl p-4 mb-6 border border-warning/30 bg-warning/5">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-warning">Verification Failed</p>
              <p className="text-sm text-muted-foreground mt-1">
                This video shows signs of AI manipulation. Do not proceed with KYC verification
                using this submission.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="glass" className="flex-1" onClick={onReset}>
          <ArrowLeft className="h-4 w-4" />
          Verify Another
        </Button>
        <Button variant="hero" className="flex-1" onClick={() => generateReport(isAuthentic, confidence, metrics)}>
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>
    </div>
  );
};
