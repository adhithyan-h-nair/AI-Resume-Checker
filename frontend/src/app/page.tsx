"use client";
import { useState } from "react";
import ResumeUpload from "@/components/ResumeUpload";
import AnalysisResult from "@/components/AnalysisResult";

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
      // const parsed = JSON.parse(data.analysis);

      setResult({
        skills: data.analysis.skills || [],
        missing_skills: data.analysis.missing_skills || [],
        suggestions: data.analysis.suggestions || [],
        score: data.analysis.score || 0,
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
            Upload your resume and get instant feedback on your skills, missing keywords, and improvement suggestions.
          </p>
        </header>

        <ResumeUpload
          file={file}
          loading={loading}
          onFileChange={handleFileChange}
          onAnalyze={handleAnalyze}
        />

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center text-sm">
            {error}
          </div>
        )}

        {result && <AnalysisResult result={result} />}

        {!result && !loading && !error && (
          <div className="mt-16 text-center text-gray-400">
            <p className="text-sm">Trusted by candidates applying to top tech companies</p>
            <div className="mt-4 flex justify-center gap-8 opacity-50 grayscale">
              <div className="h-6 w-20 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-20 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} AI Resume Checker. Built with Next.js and Tailwind CSS.
      </footer>
    </div>
  );


}