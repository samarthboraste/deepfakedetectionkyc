import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

// Mock data for the last 7 days
const chartData = [
  { date: "Mon", authentic: 142, deepfake: 18 },
  { date: "Tue", authentic: 156, deepfake: 24 },
  { date: "Wed", authentic: 189, deepfake: 31 },
  { date: "Thu", authentic: 167, deepfake: 22 },
  { date: "Fri", authentic: 201, deepfake: 28 },
  { date: "Sat", authentic: 134, deepfake: 19 },
  { date: "Sun", authentic: 100, deepfake: 16 },
];

const chartConfig = {
  authentic: {
    label: "Authentic",
    color: "hsl(var(--success))",
  },
  deepfake: {
    label: "Deepfake",
    color: "hsl(var(--destructive))",
  },
};

export const VerificationChart = () => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Weekly Verification Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="authenticGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="deepfakeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="authentic"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              fill="url(#authenticGradient)"
            />
            <Area
              type="monotone"
              dataKey="deepfake"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              fill="url(#deepfakeGradient)"
            />
          </AreaChart>
        </ChartContainer>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-success" />
            <span className="text-sm text-muted-foreground">Authentic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-sm text-muted-foreground">Deepfake</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
