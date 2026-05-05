require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

app.post("/upload", upload.single("resume"), async (req, res) => {
    try {
        const filePath = req.file.path;

        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);

        console.log("Extracted Text:", pdfData.text.slice(0, 300));

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            Analyze this resume:

            ${pdfData.text}

            Return STRICT JSON like this:
            {
            "skills": [],
            "missing_skills": [],
            "suggestions": [],
            "score": number
            }
            `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        res.json({
        message: "Analysis complete",
        analysis: cleanedText,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error processing PDF" });
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});