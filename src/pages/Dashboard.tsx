import { useState } from "react";
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp,
  FileVideo,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { VerificationChart } from "@/components/dashboard/VerificationChart";
import { RecentSubmissions } from "@/components/dashboard/RecentSubmissions";

// Mock statistics data
const stats = {
  totalVerifications: 1247,
  authenticVideos: 1089,
  deepfakesDetected: 158,
  avgProcessingTime: 3.2,
  weeklyChange: {
    total: 12.5,
    authentic: 8.3,
    deepfakes: -15.2,
  }
};

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header showDashboardLink={false} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Verification <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Monitor your deepfake detection analytics and recent submissions
            </p>
          </div>
          <Link to="/">
            <Button variant="hero">
              <FileVideo className="h-4 w-4 mr-2" />
              New Verification
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Verifications"
            value={stats.totalVerifications.toLocaleString()}
            icon={Shield}
            change={stats.weeklyChange.total}
            changeLabel="vs last week"
          />
          <StatCard
            title="Authentic Videos"
            value={stats.authenticVideos.toLocaleString()}
            icon={CheckCircle2}
            change={stats.weeklyChange.authentic}
            changeLabel="vs last week"
            iconColor="text-success"
          />
          <StatCard
            title="Deepfakes Detected"
            value={stats.deepfakesDetected.toLocaleString()}
            icon={XCircle}
            change={stats.weeklyChange.deepfakes}
            changeLabel="vs last week"
            iconColor="text-destructive"
          />
          <StatCard
            title="Avg Processing Time"
            value={`${stats.avgProcessingTime}s`}
            icon={Clock}
            subtitle="Per video analysis"
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <VerificationChart />
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Detection Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <DetectionMetric
                  label="Face Swap Detection"
                  value={42}
                  total={158}
                  color="hsl(var(--primary))"
                />
                <DetectionMetric
                  label="Lip Sync Manipulation"
                  value={38}
                  total={158}
                  color="hsl(var(--warning))"
                />
                <DetectionMetric
                  label="Voice Cloning"
                  value={31}
                  total={158}
                  color="hsl(var(--destructive))"
                />
                <DetectionMetric
                  label="Full Face Synthesis"
                  value={27}
                  total={158}
                  color="hsl(var(--accent))"
                />
                <DetectionMetric
                  label="Other Artifacts"
                  value={20}
                  total={158}
                  color="hsl(var(--muted-foreground))"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        <RecentSubmissions />
      </main>

      <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 DeepVerify. Advanced AI for identity protection.
        </div>
      </footer>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: number;
  changeLabel?: string;
  subtitle?: string;
  iconColor?: string;
}

const StatCard = ({ title, value, icon: Icon, change, changeLabel, subtitle, iconColor = "text-primary" }: StatCardProps) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg bg-primary/10 ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${
              isPositive ? "text-success" : isNegative ? "text-destructive" : "text-muted-foreground"
            }`}>
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : isNegative ? (
                <ArrowDownRight className="h-4 w-4" />
              ) : null}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
          {changeLabel && (
            <p className="text-xs text-muted-foreground/70">{changeLabel}</p>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground/70">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface DetectionMetricProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

const DetectionMetric = ({ label, value, total, color }: DetectionMetricProps) => {
  const percentage = (value / total) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value} ({percentage.toFixed(0)}%)</span>
      </div>
      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
