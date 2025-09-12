import { useState, useRef } from "react";
import { Upload, File, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onUpload: (files: File[]) => void;
}

export const ImageUpload = ({ onUpload }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{ file: File; url: string }[]>(
    [],
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles: File[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        });
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive",
        });
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const newUploadedFiles = [...uploadedFiles, ...validFiles];
    setUploadedFiles(newUploadedFiles);

    // Create previews for new files
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrls((prev) => [
          ...prev,
          { file, url: e.target?.result as string },
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Start analysis
    onUpload(newUploadedFiles);
  };

  const removeFile = (fileToRemove: File) => {
    const newUploadedFiles = uploadedFiles.filter((f) => f !== fileToRemove);
    const newPreviewUrls = previewUrls.filter((p) => p.file !== fileToRemove);

    setUploadedFiles(newUploadedFiles);
    setPreviewUrls(newPreviewUrls);

    if (newUploadedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onUpload(newUploadedFiles);
  };

  const removeAllFiles = () => {
    setUploadedFiles([]);
    setPreviewUrls([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onUpload([]);
  };

  return (
    <div className="w-full space-y-4">
      <label
        className={`
          relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
          transition-all duration-300 group
          ${
            dragActive
              ? "border-cyber-blue bg-cyber-blue/5 cyber-glow"
              : "border-border hover:border-cyber-blue/50 hover:bg-cyber-blue/5"
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-4">
          <Upload
            className={`w-8 h-8 mb-2 transition-colors ${dragActive ? "text-cyber-blue" : "text-muted-foreground group-hover:text-cyber-blue"}`}
          />
          <p className="mb-1 text-sm font-medium">
            <span className="font-semibold text-cyber-blue">
              Click to upload
            </span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            Multiple images, PNG, JPG, GIF up to 10MB each
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleChange}
        />
      </label>

      {uploadedFiles.length > 0 && (
        <div className="fraud-panel p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyber-blue" />
              <span className="text-sm font-medium">
                {uploadedFiles.length} image(s) uploaded
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeAllFiles}
              className="text-muted-foreground hover:text-destructive"
            >
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {previewUrls.map((preview, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-surface-secondary rounded-lg"
              >
                <div className="flex-shrink-0">
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border border-border"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate mb-1">
                    {preview.file.name}
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>
                      Size: {(preview.file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    <div>Type: {preview.file.type}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(preview.file)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
