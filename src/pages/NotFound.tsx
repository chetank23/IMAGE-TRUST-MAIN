import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center fraud-panel p-12 max-w-md mx-auto">
        <AlertTriangle className="h-16 w-16 text-warning-amber mx-auto mb-6" />
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <h2 className="mb-4 text-xl font-semibold">Access Denied</h2>
        <p className="mb-6 text-muted-foreground">
          The requested security endpoint could not be found or access is
          restricted.
        </p>
        <Button asChild variant="default" className="cyber-glow">
          <a href="/" className="inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Return to Security Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
