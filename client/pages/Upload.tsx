import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { UploadForm } from "@/components/resources/UploadForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Upload as UploadIcon } from "lucide-react";
import { CreateResourceRequest, UploadResponse } from "@shared/api";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [userRole, setUserRole] = useState<"student" | "lecturer">("lecturer");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleUpload = async (file: File, metadata: CreateResourceRequest) => {
    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("metadata", JSON.stringify(metadata));

      const response = await fetch("/api/resources", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as UploadResponse;

      if (result.success) {
        setUploadResult({
          success: true,
          message: "Resource uploaded successfully!",
        });
        // Auto-redirect after successful upload
        setTimeout(() => {
          navigate("/resources");
        }, 2000);
      } else {
        setUploadResult({
          success: false,
          message: result.message || "Upload failed",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadResult({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} onRoleSwitch={setUserRole} />

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <UploadIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Upload Academic Resource
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Share your academic materials with students. Upload lecture notes,
              assignments, past questions, and other educational resources.
            </p>
          </div>

          {uploadResult && (
            <div className="mb-8">
              <Alert
                variant={uploadResult.success ? "default" : "destructive"}
                className={
                  uploadResult.success
                    ? "border-success bg-success/5 text-success-foreground"
                    : ""
                }
              >
                {uploadResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{uploadResult.message}</AlertDescription>
              </Alert>
            </div>
          )}

          <UploadForm onUpload={handleUpload} isUploading={isUploading} />

          {/* Guidelines Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <h4 className="font-medium mb-2">File Requirements:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Only PDF files are accepted</li>
                    <li>• Maximum file size: 50MB</li>
                    <li>• Clear, readable content preferred</li>
                    <li>• Original or high-quality scans only</li>
                  </ul>
                </div>
                <div className="text-sm">
                  <h4 className="font-medium mb-2">Content Guidelines:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Ensure content is educational and relevant</li>
                    <li>• No copyrighted material without permission</li>
                    <li>• Use descriptive titles and accurate categories</li>
                    <li>• Add relevant tags for better discoverability</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories Explained</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-3">
                  <div>
                    <h4 className="font-medium text-blue-600">Lecture Notes</h4>
                    <p className="text-muted-foreground">
                      Class notes, slides, and teaching materials
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600">Assignments</h4>
                    <p className="text-muted-foreground">
                      Homework, projects, and coursework
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-600">
                      Past Questions
                    </h4>
                    <p className="text-muted-foreground">
                      Previous exam papers and quiz questions
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-600">Reference</h4>
                    <p className="text-muted-foreground">
                      Additional reading materials and resources
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-pink-600">Syllabus</h4>
                    <p className="text-muted-foreground">
                      Course outlines and curriculum information
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
