import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';

interface Suggestion {
  section?: string;
  suggestion: string;
}

interface AnalysisResultProps {
  result: {
    skills: string[];
    missing_skills: string[];
    suggestions: (string | Suggestion)[];
    score: number;
  };
}

const AnalysisResult = ({ result }: AnalysisResultProps) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-sm font-medium opacity-80 mb-2 uppercase tracking-wider">Overall Match Score</div>
          <div className="text-6xl font-bold">{result.score}%</div>
          <div className="mt-4 w-full max-w-xs bg-white/20 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-1000" 
              style={{ width: `${result.score}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold flex items-center gap-2">
              <span className="p-1 bg-green-100 rounded text-green-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </span>
              Key Skills Found
            </h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.skills.length > 0 ? (
                result.skills.map((skill, i) => (
                  <Badge key={i} variant="success">{skill}</Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No skills identified.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold flex items-center gap-2 text-amber-700">
              <span className="p-1 bg-amber-100 rounded text-amber-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </span>
              Missing Skills
            </h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.missing_skills.length > 0 ? (
                result.missing_skills.map((skill, i) => (
                  <Badge key={i} variant="warning">{skill}</Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">Great! No major skills missing.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-semibold flex items-center gap-2 text-blue-700">
            <span className="p-1 bg-blue-100 rounded text-blue-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </span>
            Improvement Suggestions
          </h3>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {result.suggestions.length > 0 ? (
              result.suggestions.map((s, i) => {
                const isObject = typeof s === 'object' && s !== null;
                const text = isObject ? s.suggestion : s;
                const section = isObject ? s.section : null;

                return (
                  <li key={i} className="flex gap-3 text-sm text-gray-600 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex-shrink-0 flex items-center justify-center font-bold text-xs">{i + 1}</span>
                    <div>
                      {section && <span className="block text-xs font-bold text-blue-600 uppercase tracking-tight mb-1">{section}</span>}
                      <p className="leading-relaxed">{text}</p>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="text-sm text-gray-500 italic text-center py-4">No suggestions provided.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResult;
