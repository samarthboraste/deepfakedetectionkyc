import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AnalysisResult {
  isAuthentic: boolean;
  confidence: number;
  summary?: string;
  analysis?: {
    facialConsistency?: { score: number; issues: string[] };
    temporalCoherence?: { score: number; issues: string[] };
    eyeAnalysis?: { score: number; issues: string[] };
    mouthAnalysis?: { score: number; issues: string[] };
    artifactDetection?: { score: number; issues: string[] };
  } | null;
}

interface UseVideoAnalysisReturn {
  analyzeVideo: (video: File) => Promise<AnalysisResult | null>;
  isAnalyzing: boolean;
  progress: number;
  currentStep: string;
}

export const useVideoAnalysis = (): UseVideoAnalysisReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  const extractFrames = useCallback(async (videoFile: File, numFrames: number = 8): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        reject(new Error("Could not create canvas context"));
        return;
      }

      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;

      const frames: string[] = [];
      let loadedMetadata = false;

      video.onloadedmetadata = () => {
        loadedMetadata = true;
        canvas.width = Math.min(video.videoWidth, 640); // Limit size for API
        canvas.height = Math.min(video.videoHeight, 480);
        
        const duration = video.duration;
        const interval = duration / (numFrames + 1);
        let currentFrame = 0;

        const captureFrame = () => {
          if (currentFrame >= numFrames) {
            URL.revokeObjectURL(video.src);
            resolve(frames);
            return;
          }

          const seekTime = interval * (currentFrame + 1);
          video.currentTime = Math.min(seekTime, duration - 0.1);
        };

        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frameData = canvas.toDataURL("image/jpeg", 0.8);
          frames.push(frameData);
          currentFrame++;
          setProgress(Math.round((currentFrame / numFrames) * 30)); // 0-30% for frame extraction
          captureFrame();
        };

        captureFrame();
      };

      video.onerror = () => {
        reject(new Error("Failed to load video"));
      };

      // Set timeout for metadata loading
      setTimeout(() => {
        if (!loadedMetadata) {
          reject(new Error("Video loading timed out"));
        }
      }, 30000);

      video.src = URL.createObjectURL(videoFile);
    });
  }, []);

  const analyzeVideo = useCallback(async (video: File): Promise<AnalysisResult | null> => {
    setIsAnalyzing(true);
    setProgress(0);
    setCurrentStep("Preparing video...");

    try {
      // Step 1: Extract frames
      setCurrentStep("Extracting video frames...");
      const frames = await extractFrames(video, 8);
      
      if (frames.length === 0) {
        throw new Error("Could not extract frames from video");
      }

      setProgress(30);
      setCurrentStep("Sending to AI for analysis...");

      // Step 2: Send to edge function for AI analysis
      const { data, error } = await supabase.functions.invoke("analyze-video", {
        body: { frames },
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Analysis failed");
      }

      setProgress(80);
      setCurrentStep("Processing results...");

      if (data.error) {
        throw new Error(data.error);
      }

      setProgress(100);
      setCurrentStep("Analysis complete!");

      return {
        isAuthentic: data.isAuthentic,
        confidence: data.confidence,
        summary: data.summary,
        analysis: data.analysis,
      };
    } catch (error) {
      console.error("Video analysis error:", error);
      const message = error instanceof Error ? error.message : "Analysis failed";
      toast.error(message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [extractFrames]);

  return {
    analyzeVideo,
    isAnalyzing,
    progress,
    currentStep,
  };
};
