import { useCallback, useState } from "react";
import { Upload, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  onVideoSelect: (file: File) => void;
  selectedVideo: File | null;
  onClear: () => void;
}

export const VideoUpload = ({ onVideoSelect, selectedVideo, onClear }: VideoUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith("video/")) {
      onVideoSelect(files[0]);
      setPreviewUrl(URL.createObjectURL(files[0]));
    }
  }, [onVideoSelect]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onVideoSelect(files[0]);
      setPreviewUrl(URL.createObjectURL(files[0]));
    }
  };

  const handleClear = () => {
    onClear();
    setPreviewUrl(null);
  };

  if (selectedVideo && previewUrl) {
    return (
      <div className="relative glass-card rounded-2xl overflow-hidden">
        <video
          src={previewUrl}
          className="w-full aspect-video object-cover"
          controls
        />
        <Button
          variant="glass"
          size="icon"
          className="absolute top-4 right-4"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Video className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedVideo.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative glass-card rounded-2xl p-12 transition-all duration-300",
        "border-2 border-dashed",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border/50 hover:border-primary/50"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="video/*"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileSelect}
      />
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          {isDragging && (
            <div className="absolute inset-0 rounded-2xl bg-primary/20 pulse-ring" />
          )}
        </div>
        <div>
          <p className="text-lg font-medium">
            {isDragging ? "Drop your video here" : "Drag & drop your video"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            or click to browse files
          </p>
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded-full bg-secondary">MP4</span>
          <span className="px-2 py-1 rounded-full bg-secondary">WebM</span>
          <span className="px-2 py-1 rounded-full bg-secondary">MOV</span>
        </div>
      </div>
    </div>
  );
};
