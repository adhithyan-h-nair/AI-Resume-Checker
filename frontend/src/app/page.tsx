"use client";
import { useState } from "react";
import ResumeUpload from "@/components/ResumeUpload";
import AnalysisResult from "@/components/AnalysisResult";
import { Button } from "@/components/ui/Button";

interface AnalysisData {
  skills: string[];
  missing_skills: string[];
  suggestions: (string | { section?: string; suggestion: string })[];
  score: number;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to analyze resume. Please try again.");
      }

      const data = await res.json();
      // Supporting both direct object and string-encoded JSON if the backend changes
      const analysis = typeof data.analysis === 'string' ? JSON.parse(data.analysis) : data.analysis;

      setResult({
        skills: analysis.skills || [],
        missing_skills: analysis.missing_skills || [],
        suggestions: analysis.suggestions || [],
        score: analysis.score || 0,
      });
    } catch (err) {
      console.error("Analysis failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            AI Resume <span className="text-blue-600">Analyzer</span>
          </h1>
          <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
            Get instant AI feedback on your resume.
          </p>
        </header>

        {result && (
          <>
            <AnalysisResult result={result} />
            <div className="text-center mt-8">
              <Button variant="outline" onClick={handleReset} className="mx-auto cursor-pointer">
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Upload Another Resume
              </Button>
            </div>
          </>
        )}

        {!result && (
          <div className="space-y-8">
            <ResumeUpload
              file={file}
              loading={loading}
              onFileChange={handleFileChange}
              onAnalyze={handleAnalyze}
            />
            
            {!loading && !error && (
              <div className="text-center text-gray-400 max-w-md mx-auto">
                <p className="text-sm italic">
                  Result is AI generated, expect different output for the same resume, and take the result with a grain of salt.
                </p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center text-sm">
            {error}
          </div>
        )}
      </div>

      <footer className="mt-20 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} AI Resume Checker. Built with Next.js and Tailwind CSS.
      </footer>
    </div>
  );
}