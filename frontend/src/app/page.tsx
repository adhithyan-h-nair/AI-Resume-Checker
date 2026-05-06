"use client";
import { useState } from "react"
export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0])
  }

  const handleAnalyze = async () => {
    if (!file) {
      setResult("Please Upload File first")
      return;
    }
    setResult("Uploading.....")

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true)
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      setLoading(false);

      const data = await res.json();
      const parsed = JSON.parse(data.analysis)
      setResult({
        skills: parsed.skills || [],
        missing_skills: parsed.missing_skills || [],
        suggestions: parsed.suggestions || [],
        score: parsed.score || 0,
      });
    }
    catch (err) {
      console.error("JSON parse failed:", err);
      setResult(null);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>AI Resume Analyzer</h1>

      <input type="file" onChange={handleFileChange} />

      <br /> <br />
      <button onClick={handleAnalyze} disabled={loading} >{loading?"Analyzing...":"Analyze"}</button>

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Analysis Result</h2>

          <h3>📊 Score: {result.score}</h3>

          <h3>🧠 Skills</h3>
          <ul>
            {result?.skills?.map((skill: string, i: number) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>

          <h3>⚠️ Missing Skills</h3>
          <ul>
            {result?.missing_skills?.map((skill: string, i: number) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>

          <h3>💡 Suggestions</h3>
          <ul>
            {result?.suggestions?.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}