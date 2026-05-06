import React from 'react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';

interface ResumeUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyze: () => void;
  loading: boolean;
  file: File | null;
}

const ResumeUpload = ({ onFileChange, onAnalyze, loading, file }: ResumeUploadProps) => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-blue-500 transition-colors bg-gray-50/50 cursor-pointer relative">
          <input
            type="file"
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf"
          />
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">PDF files only (max. 10MB)</p>
          </div>
        </div>

        {file && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
            <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span className="truncate">{file.name}</span>
          </div>
        )}

        <Button 
          onClick={onAnalyze} 
          loading={loading} 
          className="w-full"
          disabled={!file}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
