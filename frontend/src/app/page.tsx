"use client" ;
import { useState } from "react"
export default function Home(){
    const [result, setResult] = useState("No analysis yet")

    const handleAnalyze = () => {
        setResult("Analyzing....Fake one for now")
    }

    return(
        <main style={{padding: "2rem"}}>
            <h1>AI Resume Analyzer</h1>

            <input type="file" />

            <br /> <br />
            <button onClick={handleAnalyze}>Analyze</button>

            <div style={{marginTop: "2rem"}}>
                <h2>Result:</h2>
                <p>{result}</p>
            </div>
        </main>
    )
}