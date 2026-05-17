import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-init Gemini
let genAI: GoogleGenAI | null = null;
const getAI = () => {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set");
        }
        genAI = new GoogleGenAI({ apiKey });
    }
    return genAI;
};

// Recommendation API
app.post("/api/recommend", async (req, res) => {
    try {
        const { mood, exhaustion, routine, preference, vibe } = req.body;
        
        const prompt = `
            You are Reelief, an expert entertainment recommendation agent for exhausted students and professionals.
            Your job is to recommend 3-4 movies or web series to help the user "Reset" their mind for the weekend.
            
            USER PROFILE:
            - Mood: ${mood}
            - Exhaustion Level: ${exhaustion}/10
            - Weekly Routine: ${routine}
            - Preferred Format: ${preference}
            - Desired Vibe: ${vibe}
            
            STRICT CONSTRAINTS:
            1. Recommend ONLY Bollywood (Hindi) or Hollywood (English) content.
            2. Recommend ONLY content released in the last 3 years (2023, 2024, 2025, or 2026).
            3. Include at least 1 "Comfort Watch", 1 "Thriller/Exciting", and 1 "Hidden Gem".
            4. If the user is at 8+ exhaustion, suggest lighter or animated content.
            
            RESPONSE FORMAT: Return a valid JSON array of objects. Each object must have:
            - title (string)
            - year (number)
            - type (Movie or Series)
            - region (Bollywood or Hollywood)
            - vibe (A short category like 'Comfort', 'High Energy', 'Emotional Reset')
            - logic (1 sentence explaining why this fits their current mental state)
            - runtime (string)
            - language (string)
            - overview (A brief but detailed 2-3 sentence introduction or short description of the content)

            DO NOT return any text other than the JSON array.
        `;

        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });
        
        const text = response.text;
        
        if (!text) {
            throw new Error("No text returned from Gemini");
        }
        
        // Basic cleaning in case model adds markdown blocks
        const jsonText = text.replace(/```json|```/g, "").trim();
        const recommendations = JSON.parse(jsonText);
        
        res.json({ recommendations });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to generate recommendations" });
    }
});

// Vite Middleware
async function bootstrap() {
    if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), "dist");
        app.use(express.static(distPath));
        app.get("*", (req, res) => {
            res.sendFile(path.join(distPath, "index.html"));
        });
    }

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Reelief Server running on http://localhost:${PORT}`);
    });
}

bootstrap();
