import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { FraudMetrics } from "@/components/FraudMetrics";
import { SystemStatus } from "@/components/SystemStatus";
import { Shield, Zap, Eye, Brain } from "lucide-react";

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

const Index = () => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [projectDescription, setProjectDescription] = useState("");

  const handleImageUpload = (files: File[]) => {
    if (files.length === 0) {
      setAnalysisResults([]);
      return;
    }

    // Create initial analyzing states for all files
    const initialResults = files.map((file) => ({
      duplicateScore: 0,
      manipulationScore: 0,
      clipSimilarity: 0,
      metadata: {
        exifStripped: false,
        dimensions: "",
        fileSize: "",
        timestamp: "",
      },
      isAnalyzing: true,
      fileName: file.name,
    }));

    setAnalysisResults(initialResults);

    // Simulate API calls with realistic analysis for each file
    files.forEach((file, index) => {
      setTimeout(
        () => {
          const duplicateScore = Math.random() * 100;
          const manipulationScore = Math.random() * 100;
          const clipSimilarity = Math.random() * 100;

          setAnalysisResults((prev) =>
            prev.map((result, i) =>
              i === index
                ? {
                    duplicateScore,
                    manipulationScore,
                    clipSimilarity,
                    metadata: {
                      exifStripped: Math.random() > 0.5,
                      dimensions: `${Math.floor(Math.random() * 2000) + 800}x${Math.floor(Math.random() * 2000) + 600}`,
                      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
                      timestamp: new Date().toISOString(),
                    },
                    isAnalyzing: false,
                    fileName: file.name,
                  }
                : result,
            ),
          );
        },
        2000 + index * 1000,
      ); // Stagger the results
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-surface-primary via-surface-secondary to-surface-elevated">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-6 py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-surface-glass border border-border/50 backdrop-blur-md">
              <Shield className="h-5 w-5 text-cyber-blue" />
              <span className="text-sm font-medium text-cyber-blue">
                AI-Powered Security
              </span>
            </div>

            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-cyber-blue to-cyber-teal bg-clip-text text-transparent">
              Image Authenticity & Fraud Detection System
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Advanced AI system to detect fraudulent submissions, manipulated
              images, and ghost implementations using cutting-edge computer
              vision and deep learning models.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="fraud-panel-glass p-6 text-center">
                <Eye className="h-8 w-8 text-cyber-blue mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Duplicate Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Perceptual hashing & deep embeddings
                </p>
              </div>
              <div className="fraud-panel-glass p-6 text-center">
                <Zap className="h-8 w-8 text-cyber-teal mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Manipulation Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  EXIF metadata & CNN detection
                </p>
              </div>
              <div className="fraud-panel-glass p-6 text-center">
                <Brain className="h-8 w-8 text-neural-purple mx-auto mb-3" />
                <h3 className="font-semibold mb-2">CLIP Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Image-text consistency scoring
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Analysis Interface */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Input */}
          <div className="lg:col-span-1 space-y-6">
            <SystemStatus />

            <div className="fraud-panel p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyber-blue" />
                Submit for Analysis
              </h2>

              <ImageUpload onUpload={handleImageUpload} />

              <div className="mt-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-2"
                >
                  Project Description
                </label>
                <textarea
                  id="description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full h-32 px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none font-mono text-sm"
                  placeholder="Describe your project implementation, features, and technical details..."
                />
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {analysisResults.length > 0 && (
              <>
                <FraudMetrics results={analysisResults} />
                <AnalysisResults
                  results={analysisResults}
                  projectDescription={projectDescription}
                />
              </>
            )}

            {analysisResults.length === 0 && (
              <div className="fraud-panel p-12 text-center">
                <Shield className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  Ready for Analysis
                </h3>
                <p className="text-muted-foreground">
                  Upload images to begin fraud detection analysis
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
