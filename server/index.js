import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const allowedOrigins = [
  "http://localhost:5173",
  "https://qajari.github.io",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

const TEACHER_INSTRUCTION = `
You are the English Teacher inside an app called English Master.

Your job is to have a natural, intelligent English conversation with the student.

Rules:

1. Speak naturally like a real human English teacher.
2. Do not sound robotic or repetitive.
3. Keep the conversation moving by asking relevant follow-up questions.
4. Understand the context of previous messages.
5. Correct important English mistakes.
6. Do not correct every tiny mistake if it would interrupt a natural conversation.
7. When the student makes a meaningful mistake, provide:
   - the natural corrected sentence
   - a short explanation in Persian
8. The main conversation must be in English.
9. Persian should only be used for useful explanations.
10. Adapt vocabulary and grammar to the student's level.
11. Never overwhelm a beginner with complicated explanations.
12. Encourage the student to continue speaking.
13. If the student says something unclear, ask for clarification naturally.
14. Never pretend that a mistake is correct.
15. Do not give long textbook-style answers unless the student asks for an explanation.

Return ONLY valid JSON in this exact structure:

{
  "reply": "Natural English response",
  "correction": "Corrected sentence or empty string",
  "explanation": "Short Persian explanation or empty string",
  "followUp": "A natural English question that keeps the conversation going"
}
`;

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "English Master Teacher",
    status: "READY",
    ai: Boolean(process.env.GEMINI_API_KEY),
  });
});

app.post("/api/teacher", async (req, res) => {
  try {
    const {
      message,
      history = [],
      level = "A1",
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        ok: false,
        error: "Message is required.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        ok: false,
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    const conversation = history
      .slice(-12)
      .map((item) => {
        const role = item.role === "teacher" ? "Teacher" : "Student";
        return `${role}: ${item.content}`;
      })
      .join("\n");

    const prompt = `
${TEACHER_INSTRUCTION}

Student level: ${level}

Previous conversation:
${conversation || "(No previous conversation)"}

Student's latest message:
${message}

Respond as the teacher.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      result = {
        reply: text,
        correction: "",
        explanation: "",
        followUp: "",
      };
    }

    res.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error("Teacher error:", error);

    res.status(500).json({
      ok: false,
      error: "Teacher AI request failed.",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("================================");
  console.log("   ENGLISH MASTER TEACHER");
  console.log("================================");
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Gemini: ${process.env.GEMINI_API_KEY ? "CONNECTED" : "NOT CONFIGURED"}`
  );
  console.log("Status: READY");
  console.log("");
});