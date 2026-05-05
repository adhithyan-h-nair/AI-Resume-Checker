"use client" ;
import { useState } from "react"
export default function Home(){
    const [file, setFile] = useState<File | null>(null)
    const [result, setResult] = useState("No analysis yet")

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

        try{
            const res = await fetch("http://localhost:5000/upload",{
                method:"POST",
                body: formData,
            });

            const data = await res.json();
            setResult(`${data.message} - ${data.fileName}`);
        }
        catch(err){
            setResult("Upload Failed");
            console.error(err);
        }
    };

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