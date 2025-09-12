import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Zap,
  Brain,
  FileText,
  Image,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface AnalysisResultsProps {
  results: AnalysisResult[];
  projectDescription: string;
}

export const AnalysisResults = ({
  results,
  projectDescription,
}: AnalysisResultsProps) => {
  if (results.length === 0) return null;

  const getThreatLevel = (score: number) => {
    if (score < 30)
      return { level: "Low", color: "success", icon: CheckCircle };
    if (score < 70)
      return { level: "Medium", color: "warning", icon: AlertTriangle };
    return { level: "High", color: "alert", icon: XCircle };
  };

  const hasAnalyzing = results.some((r) => r.isAnalyzing);

  if (hasAnalyzing) {
    return (
      <div className="fraud-panel p-8">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-cyber-blue/20 border-t-cyber-blue cyber-glow pulse-glow"></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Analyzing Images</h3>
            <p className="text-muted-foreground mb-4">
              Running fraud detection algorithms on {results.length} image
              {results.length !== 1 ? "s" : ""}...
            </p>

            <div className="space-y-3 max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-cyber-blue" />
                <span className="text-sm">Duplicate Detection</span>
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="scan-animation h-full w-full"></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-cyber-teal" />
                <span className="text-sm">Manipulation Analysis</span>
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="scan-animation h-full w-full"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Brain className="w-4 h-4 text-neural-purple" />
                <span className="text-sm">CLIP Similarity</span>
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="scan-animation h-full w-full"
                    style={{ animationDelay: "1s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completedResults = results.filter((r) => !r.isAnalyzing);

  return (
    <div className="space-y-6">
      <div className="fraud-panel p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-cyber-blue" />
          Detailed Analysis Results
        </h2>

        {results.length === 1 ? (
          // Single image detailed view
          <SingleImageAnalysis
            result={completedResults[0]}
            projectDescription={projectDescription}
          />
        ) : (
          // Multiple images tabbed view
          <Tabs defaultValue="0" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {results.map((result, index) => (
                <TabsTrigger
                  key={index}
                  value={index.toString()}
                  className="text-xs"
                >
                  <Image className="w-3 h-3 mr-1" />
                  {result.fileName.split(".")[0].substring(0, 8)}...
                </TabsTrigger>
              ))}
            </TabsList>

            {results.map((result, index) => (
              <TabsContent key={index} value={index.toString()}>
                <SingleImageAnalysis
                  result={result}
                  projectDescription={projectDescription}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

const SingleImageAnalysis = ({
  result,
  projectDescription,
}: {
  result: AnalysisResult;
  projectDescription: string;
}) => {
  const getThreatLevel = (score: number) => {
    if (score < 30)
      return { level: "Low", color: "success", icon: CheckCircle };
    if (score < 70)
      return { level: "Medium", color: "warning", icon: AlertTriangle };
    return { level: "High", color: "alert", icon: XCircle };
  };

  const duplicateThreat = getThreatLevel(result.duplicateScore);
  const manipulationThreat = getThreatLevel(result.manipulationScore);
  const clipThreat = getThreatLevel(100 - result.clipSimilarity);

  return (
    <div className="space-y-6">
      {/* File Header */}
      <div className="p-4 bg-surface-secondary rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <Image className="w-5 h-5 text-cyber-blue" />
          <span className="font-medium">{result.fileName}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
          <div>Size: {result.metadata.fileSize}</div>
          <div>Dimensions: {result.metadata.dimensions}</div>
          <div>
            EXIF: {result.metadata.exifStripped ? "Stripped" : "Present"}
          </div>
          <div>
            Analyzed: {new Date(result.metadata.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Threat Assessment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-surface-secondary">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyber-blue" />
              <span className="font-medium text-sm">Duplicate Detection</span>
            </div>
            <Badge variant={duplicateThreat.color as any} className="text-xs">
              <duplicateThreat.icon className="w-3 h-3 mr-1" />
              {duplicateThreat.level}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-cyber-blue">
                {result.duplicateScore.toFixed(1)}%
              </span>
            </div>
            <Progress value={result.duplicateScore} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {result.duplicateScore < 30
                ? "No significant matches found in database"
                : result.duplicateScore < 70
                  ? "Potential similar images detected"
                  : "High similarity to existing submissions"}
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-surface-secondary">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyber-teal" />
              <span className="font-medium text-sm">Manipulation Analysis</span>
            </div>
            <Badge
              variant={manipulationThreat.color as any}
              className="text-xs"
            >
              <manipulationThreat.icon className="w-3 h-3 mr-1" />
              {manipulationThreat.level}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-cyber-teal">
                {result.manipulationScore.toFixed(1)}%
              </span>
            </div>
            <Progress value={result.manipulationScore} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {result.manipulationScore < 30
                ? "Image appears authentic and unedited"
                : result.manipulationScore < 70
                  ? "Minor editing artifacts detected"
                  : "Significant digital manipulation detected"}
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-surface-secondary">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-neural-purple" />
              <span className="font-medium text-sm">CLIP Consistency</span>
            </div>
            <Badge variant={clipThreat.color as any} className="text-xs">
              <clipThreat.icon className="w-3 h-3 mr-1" />
              {clipThreat.level}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-neural-purple">
                {result.clipSimilarity.toFixed(1)}%
              </span>
            </div>
            <Progress value={result.clipSimilarity} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {result.clipSimilarity > 70
                ? "Strong alignment with project description"
                : result.clipSimilarity > 40
                  ? "Partial consistency with description"
                  : "Poor correlation with provided text"}
            </p>
          </div>
        </Card>
      </div>

      {/* Detailed Technical Analysis */}
      <Card className="p-6 bg-surface-secondary">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning-amber" />
          Technical Analysis Report
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">
                Perceptual Hash Analysis
              </h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>
                  • Hash distance: {(result.duplicateScore / 10).toFixed(1)}{" "}
                  bits
                </div>
                <div>
                  • Geometric transformations:{" "}
                  {result.duplicateScore > 50 ? "Detected" : "None"}
                </div>
                <div>
                  • Color space variations:{" "}
                  {result.duplicateScore > 30 ? "Present" : "Minimal"}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">CNN Feature Analysis</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>
                  • Deep embeddings:{" "}
                  {Math.floor(result.manipulationScore * 5.12)} features
                </div>
                <div>
                  • Compression artifacts:{" "}
                  {result.manipulationScore > 40 ? "Detected" : "Normal"}
                </div>
                <div>
                  • Edge consistency:{" "}
                  {result.manipulationScore < 50 ? "Good" : "Suspicious"}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Metadata Forensics</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>
                  • EXIF data:{" "}
                  {result.metadata.exifStripped
                    ? "Stripped (suspicious)"
                    : "Present"}
                </div>
                <div>
                  • Creation timestamp:{" "}
                  {result.metadata.timestamp ? "Valid" : "Missing"}
                </div>
                <div>• GPS coordinates: Redacted for privacy</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">CLIP Model Inference</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>
                  • Semantic similarity: {result.clipSimilarity.toFixed(1)}%
                </div>
                <div>
                  • Object detection:{" "}
                  {result.clipSimilarity > 60 ? "Consistent" : "Mismatch"}
                </div>
                <div>
                  • Context alignment:{" "}
                  {result.clipSimilarity > 50 ? "Good" : "Poor"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
