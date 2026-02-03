import { useState, useEffect } from "react";
import { Shield, Zap, Eye, Brain, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { VideoUpload } from "@/components/VideoUpload";
import { ProcessingState } from "@/components/ProcessingState";
import { VerificationResult } from "@/components/VerificationResult";
import { FeatureCard } from "@/components/FeatureCard";
import { useVideoAnalysis } from "@/hooks/useVideoAnalysis";

type AppState = "landing" | "upload" | "processing" | "result";

const Index = () => {
  const { analyzeVideo, isAnalyzing, progress, currentStep } = useVideoAnalysis();
  const [appState, setAppState] = useState<AppState>("landing");
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [result, setResult] = useState<{ isAuthentic: boolean; confidence: number; summary?: string } | null>(null);

  const handleVideoSelect = (file: File) => {
    setSelectedVideo(file);
  };

  const handleStartVerification = async () => {
    if (selectedVideo) {
      setAppState("processing");
      
      const analysisResult = await analyzeVideo(selectedVideo);
      
      if (analysisResult) {
        setResult({
          isAuthentic: analysisResult.isAuthentic,
          confidence: analysisResult.confidence,
          summary: analysisResult.summary,
        });
        setAppState("result");
      } else {
        // On error, go back to upload
        setAppState("upload");
      }
    }
  };

  const handleReset = () => {
    setSelectedVideo(null);
    setResult(null);
    setAppState("landing");
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description: "Advanced neural networks trained on millions of deepfake samples",
    },
    {
      icon: Zap,
      title: "Real-time Analysis",
      description: "Get verification results in seconds, not hours",
    },
    {
      icon: Eye,
      title: "Multi-Layer Scanning",
      description: "Facial, temporal, and artifact analysis combined",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your videos are processed securely and never stored",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        {/* Landing State */}
        {appState === "landing" && (
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
                <Shield className="h-4 w-4" />
                Trusted by 500+ enterprises worldwide
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Detect Deepfakes with
                <br />
                <span className="gradient-text">AI Precision</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Protect your KYC process from fraudulent video submissions.
                Our advanced AI instantly identifies manipulated videos with 99.7% accuracy.
              </p>

              <Button
                variant="hero"
                size="xl"
                onClick={() => setAppState("upload")}
                className="group"
              >
                Start Verification
                <CheckCircle2 className="h-5 w-5 transition-transform group-hover:scale-110" />
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Enterprise-grade security for modern identity verification
              </p>
              <div className="flex justify-center items-center gap-8 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm">GDPR Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm">ISO 27001</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload State */}
        {appState === "upload" && (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Upload Video for Verification</h2>
              <p className="text-muted-foreground">
                Upload a video file to check for deepfake manipulation
              </p>
            </div>

            <VideoUpload
              onVideoSelect={handleVideoSelect}
              selectedVideo={selectedVideo}
              onClear={() => setSelectedVideo(null)}
            />

            <div className="flex gap-4 mt-6">
              <Button variant="glass" className="flex-1" onClick={handleReset}>
                Cancel
              </Button>
              <Button
                variant="hero"
                className="flex-1"
                disabled={!selectedVideo}
                onClick={handleStartVerification}
              >
                Verify Video
              </Button>
            </div>
          </div>
        )}

        {/* Processing State */}
        {appState === "processing" && (
          <ProcessingState progress={progress} currentStep={currentStep} />
        )}

        {/* Result State */}
        {appState === "result" && result && (
          <VerificationResult
            isAuthentic={result.isAuthentic}
            confidence={result.confidence}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 DeepVerify. Advanced AI for identity protection.
        </div>
      </footer>
    </div>
  );
};

export default Index;
