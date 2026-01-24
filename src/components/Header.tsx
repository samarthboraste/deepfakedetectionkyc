import { Shield, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  showDashboardLink?: boolean;
}

export const Header = ({ showDashboardLink = true }: HeaderProps) => {
  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-lg">
            <span className="gradient-text">Deep</span>Verify
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {showDashboardLink && (
            <Link to="/dashboard">
              <Button variant="glass" size="sm">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span>AI System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};
