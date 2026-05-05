"use client" ;
import { useState } from "react"
export default function Home(){
    const [file, setFile] = useState<File | null>(null)
    const [result, setResult] = useState("No analysis yet")

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0])
    }

    const handleAnalyze = () => {
        if (!file) {
            setResult("Please Upload File first")
            return;
        }

        setResult(`Analyzing ${file.name} (fake for now)`)
    }

    return(
        <main style={{padding: "2rem"}}>
            <h1>AI Resume Analyzer</h1>

            <input type="file" onChange={handleFileChange}/>

            <br /> <br />
            <button onClick={handleAnalyze} disabled={!file} >Analyze</button>

            <div style={{marginTop: "2rem"}}>
                <h2>Result:</h2>
                <p>{result}</p>
            </div>
        </main>
    )
}