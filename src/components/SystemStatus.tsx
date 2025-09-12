import { useState, useEffect } from "react";
import { Server, Cpu, Database, Zap, CheckCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  queueLength: number;
  modelsLoaded: number;
  uptime: string;
  status: "online" | "maintenance" | "error";
}

export const SystemStatus = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    queueLength: 0,
    modelsLoaded: 4,
    uptime: "00:00:00",
    status: "online",
  });

  // Simulate real-time metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.max(
          10,
          Math.min(85, prev.cpuUsage + (Math.random() - 0.5) * 10),
        ),
        memoryUsage: Math.max(
          30,
          Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5),
        ),
        queueLength: Math.max(0, Math.floor(Math.random() * 5)),
      }));
    }, 2000);

    // Initialize with random values
    setMetrics({
      cpuUsage: 35 + Math.random() * 30,
      memoryUsage: 45 + Math.random() * 25,
      queueLength: Math.floor(Math.random() * 3),
      modelsLoaded: 4,
      uptime: "12:34:56",
      status: "online",
    });

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "success-green";
      case "maintenance":
        return "warning-amber";
      case "error":
        return "alert-red";
      default:
        return "muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return CheckCircle;
      case "maintenance":
        return Clock;
      default:
        return Server;
    }
  };

  const StatusIcon = getStatusIcon(metrics.status);

  return (
    <div className="fraud-panel p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Server className="h-5 w-5 text-cyber-blue" />
        System Status
      </h2>

      <div className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
          <div className="flex items-center gap-3">
            <StatusIcon
              className={`w-5 h-5 text-${getStatusColor(metrics.status)}`}
            />
            <div>
              <div className="font-medium">AI Detection Engine</div>
              <div className="text-xs text-muted-foreground">
                All systems operational
              </div>
            </div>
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(metrics.status)}/10 text-${getStatusColor(metrics.status)}`}
          >
            {metrics.status.toUpperCase()}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 bg-surface-secondary border-border">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-cyber-blue" />
              <span className="text-xs font-medium">CPU Usage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyber-blue to-cyber-teal transition-all duration-1000"
                  style={{ width: `${metrics.cpuUsage}%` }}
                ></div>
              </div>
              <span className="text-xs font-mono">
                {metrics.cpuUsage.toFixed(0)}%
              </span>
            </div>
          </Card>

          <Card className="p-3 bg-surface-secondary border-border">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-cyber-teal" />
              <span className="text-xs font-medium">Memory</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyber-teal to-neural-purple transition-all duration-1000"
                  style={{ width: `${metrics.memoryUsage}%` }}
                ></div>
              </div>
              <span className="text-xs font-mono">
                {metrics.memoryUsage.toFixed(0)}%
              </span>
            </div>
          </Card>

          <Card className="p-3 bg-surface-secondary border-border">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-neural-purple" />
              <span className="text-xs font-medium">Queue</span>
            </div>
            <div className="text-lg font-bold text-neural-purple">
              {metrics.queueLength}
            </div>
            <div className="text-xs text-muted-foreground">pending jobs</div>
          </Card>

          <Card className="p-3 bg-surface-secondary border-border">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-success-green" />
              <span className="text-xs font-medium">Models</span>
            </div>
            <div className="text-lg font-bold text-success-green">
              {metrics.modelsLoaded}/4
            </div>
            <div className="text-xs text-muted-foreground">loaded</div>
          </Card>
        </div>

        {/* Model Status */}
        <div className="space-y-2">
          <div className="text-sm font-medium mb-2">Loaded Models</div>
          <div className="space-y-1 text-xs">
            {[
              { name: "EfficientNet-B7", status: "ready", type: "CNN" },
              {
                name: "CLIP-ViT-B/32",
                status: "ready",
                type: "Vision-Language",
              },
              { name: "pHash Detector", status: "ready", type: "Perceptual" },
              { name: "EXIF Analyzer", status: "ready", type: "Metadata" },
            ].map((model, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-surface-elevated rounded"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success-green"></div>
                  <span className="font-mono">{model.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{model.type}</span>
                  <span className="text-success-green">✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
