import { CheckCircle2, XCircle, Clock, FileVideo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock recent submissions data
const recentSubmissions = [
  {
    id: "VER-001247",
    filename: "kyc_video_john_doe.mp4",
    date: "2026-01-24 14:32",
    status: "authentic" as const,
    confidence: 97,
    processingTime: 2.8,
  },
  {
    id: "VER-001246",
    filename: "identity_check_jane.webm",
    date: "2026-01-24 13:45",
    status: "deepfake" as const,
    confidence: 34,
    processingTime: 3.1,
  },
  {
    id: "VER-001245",
    filename: "user_verification_002.mp4",
    date: "2026-01-24 12:18",
    status: "authentic" as const,
    confidence: 94,
    processingTime: 2.5,
  },
  {
    id: "VER-001244",
    filename: "face_scan_michael.mp4",
    date: "2026-01-24 11:52",
    status: "authentic" as const,
    confidence: 99,
    processingTime: 2.2,
  },
  {
    id: "VER-001243",
    filename: "onboarding_video_sarah.webm",
    date: "2026-01-24 10:30",
    status: "deepfake" as const,
    confidence: 28,
    processingTime: 3.4,
  },
  {
    id: "VER-001242",
    filename: "kyc_recording_alex.mp4",
    date: "2026-01-24 09:15",
    status: "authentic" as const,
    confidence: 96,
    processingTime: 2.7,
  },
  {
    id: "VER-001241",
    filename: "verification_clip_emma.mp4",
    date: "2026-01-23 18:42",
    status: "authentic" as const,
    confidence: 92,
    processingTime: 3.0,
  },
  {
    id: "VER-001240",
    filename: "identity_video_david.webm",
    date: "2026-01-23 16:28",
    status: "deepfake" as const,
    confidence: 41,
    processingTime: 3.2,
  },
];

export const RecentSubmissions = () => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileVideo className="h-5 w-5 text-primary" />
          Recent Submissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Filename</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Confidence</TableHead>
              <TableHead className="text-right">Processing Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSubmissions.map((submission) => (
              <TableRow key={submission.id} className="hover:bg-muted/20">
                <TableCell className="font-mono text-sm">{submission.id}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={submission.filename}>
                  {submission.filename}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {submission.date}
                </TableCell>
                <TableCell>
                  {submission.status === "authentic" ? (
                    <Badge variant="outline" className="border-success/50 text-success bg-success/10">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Authentic
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-destructive/50 text-destructive bg-destructive/10">
                      <XCircle className="h-3 w-3 mr-1" />
                      Deepfake
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-medium ${
                    submission.status === "authentic" ? "text-success" : "text-destructive"
                  }`}>
                    {submission.confidence}%
                  </span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  <div className="flex items-center justify-end gap-1">
                    <Clock className="h-3 w-3" />
                    {submission.processingTime}s
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
