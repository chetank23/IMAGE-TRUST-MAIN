import { TrendingUp, Shield, AlertTriangle, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AnalysisResult {
  duplicateScore: number;
  manipulationScore: number;
  clipSimilarity: number;
  metadata: {
    exifStripped: boolean;
    dimensions: string;
    fileSize: string;
    timestamp: string;
  };
  isAnalyzing: boolean;
  fileName: string;
}

interface FraudMetricsProps {
  results: AnalysisResult[];
}

export const FraudMetrics = ({ results }: FraudMetricsProps) => {
  const calculateOverallRisk = (result: AnalysisResult) => {
    if (result.isAnalyzing) return 0;

    const weights = {
      duplicate: 0.4,
      manipulation: 0.4,
      clip: 0.2,
    };

    return (
      result.duplicateScore * weights.duplicate +
      result.manipulationScore * weights.manipulation +
      (100 - result.clipSimilarity) * weights.clip
    );
  };

  const calculateAverageScores = () => {
    if (results.length === 0)
      return { duplicateScore: 0, manipulationScore: 0, clipSimilarity: 0 };

    const completedResults = results.filter((r) => !r.isAnalyzing);
    if (completedResults.length === 0)
      return { duplicateScore: 0, manipulationScore: 0, clipSimilarity: 0 };

    return {
      duplicateScore:
        completedResults.reduce((sum, r) => sum + r.duplicateScore, 0) /
        completedResults.length,
      manipulationScore:
        completedResults.reduce((sum, r) => sum + r.manipulationScore, 0) /
        completedResults.length,
      clipSimilarity:
        completedResults.reduce((sum, r) => sum + r.clipSimilarity, 0) /
        completedResults.length,
    };
  };

  const averages = calculateAverageScores();
  const overallRisk = calculateOverallRisk({
    ...averages,
    metadata: {
      exifStripped: false,
      dimensions: "",
      fileSize: "",
      timestamp: "",
    },
    isAnalyzing: false,
    fileName: "",
  });

  const riskLevel =
    overallRisk < 30 ? "Low" : overallRisk < 70 ? "Medium" : "High";
  const riskColor =
    overallRisk < 30
      ? "success-green"
      : overallRisk < 70
        ? "warning-amber"
        : "alert-red";

  const hasAnalyzing = results.some((r) => r.isAnalyzing);

  if (results.length === 0) return null;

  if (hasAnalyzing) {
    return (
      <div className="fraud-panel p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyber-blue pulse-glow" />
          Real-time Analysis ({results.filter((r) => !r.isAnalyzing).length}/
          {results.length} complete)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 bg-surface-secondary animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fraud-panel p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-cyber-blue" />
        Fraud Detection Metrics ({results.length} image
        {results.length !== 1 ? "s" : ""})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className={`p-4 bg-surface-secondary border-border relative overflow-hidden ${overallRisk > 70 ? "alert-glow" : overallRisk > 30 ? "" : "success-glow"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <Shield className={`w-5 h-5 text-${riskColor}`} />
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full bg-${riskColor}/10 text-${riskColor}`}
            >
              {riskLevel}
            </span>
          </div>
          <div className={`text-2xl font-bold text-${riskColor} mb-1`}>
            {overallRisk.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">
            Average Risk Score
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-30"></div>
        </Card>

        <Card className="p-4 bg-surface-secondary border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="w-5 h-5 rounded-full bg-cyber-blue/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyber-blue"></div>
            </div>
            <span className="text-xs text-muted-foreground">Duplicate</span>
          </div>
          <div className="text-2xl font-bold text-cyber-blue mb-1">
            {averages.duplicateScore.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">Avg Similarity</div>
        </Card>

        <Card className="p-4 bg-surface-secondary border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="w-5 h-5 rounded-full bg-cyber-teal/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyber-teal"></div>
            </div>
            <span className="text-xs text-muted-foreground">
              Edit Detection
            </span>
          </div>
          <div className="text-2xl font-bold text-cyber-teal mb-1">
            {averages.manipulationScore.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">Avg Manipulation</div>
        </Card>

        <Card className="p-4 bg-surface-secondary border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="w-5 h-5 rounded-full bg-neural-purple/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-neural-purple"></div>
            </div>
            <span className="text-xs text-muted-foreground">CLIP Match</span>
          </div>
          <div className="text-2xl font-bold text-neural-purple mb-1">
            {averages.clipSimilarity.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">Avg Consistency</div>
        </Card>
      </div>

      {/* Quick insights */}
      <div className="mt-6 p-4 fraud-panel-glass rounded-lg">
        <h3 className="font-medium mb-2 text-sm">Assessment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full bg-${averages.duplicateScore < 30 ? "success-green" : averages.duplicateScore < 70 ? "warning-amber" : "alert-red"}`}
            ></div>
            <span>
              {averages.duplicateScore < 30
                ? "Low duplicate risk across images"
                : averages.duplicateScore < 70
                  ? "Moderate duplicate patterns detected"
                  : "High duplicate risk in submissions"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full bg-${averages.manipulationScore < 30 ? "success-green" : averages.manipulationScore < 70 ? "warning-amber" : "alert-red"}`}
            ></div>
            <span>
              {averages.manipulationScore < 30
                ? "Images appear authentic"
                : averages.manipulationScore < 70
                  ? "Some editing artifacts detected"
                  : "Significant manipulation detected"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full bg-${averages.clipSimilarity > 70 ? "success-green" : averages.clipSimilarity > 40 ? "warning-amber" : "alert-red"}`}
            ></div>
            <span>
              {averages.clipSimilarity > 70
                ? "Good description alignment"
                : averages.clipSimilarity > 40
                  ? "Partial description consistency"
                  : "Poor image-text matching"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
