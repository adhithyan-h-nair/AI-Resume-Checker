import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Use the new SDK we talked about!
import { z } from "zod";
import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import pdfParse from "pdf-parse-debugging-disabled";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

app.post("/upload", upload.single("resume"), async (req, res) => {
    try {
        const filePath = req.file.path;

        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);

        console.log("Extracted Text:", pdfData.text.slice(0, 300));

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
                        Analyze this resume and return ONLY valid JSON.

                        Response format:
                        {
                        "score": number,
                        "skills": string[],
                        "missing_skills": string[],
                        "suggestions": string[]
                        }

                        Rules:
                        - Crucial: First, evaluate if the provided text is actually a resume/CV. 
                            - If it IS a resume, set "isResume" to true.
                            - If it IS NOT a resume (e.g., it is a report, lorem ipsum, textbook page, code, etc.), set "isResume" to false.
                        - suggestions must be short, clean sentences
                        - no markdown
                        - no headings
                        - no bullet symbols
                        - no extra explanation
                        - return only pure JSON
                        - maximum 10 suggestions

                        Resume:
                        ${pdfData.text}
                        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedAnalysis = JSON.parse(cleanedText);
        console.log(parsedAnalysis)
        res.json({
        message: "Analysis complete",
        analysis: parsedAnalysis,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error processing PDF" });
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});