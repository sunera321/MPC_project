import Groq from "groq-sdk";
import { PROMPT_TEMPLATE } from "./prompt.js";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

function safeExtractJSON(text) {
  if (!text) return null;

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) return null;

  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function analyzeWithGroq(news) {
  const newsText = news
    .map(n => `- ${n.title}: ${n.description}`)
    .join("\n");

  const prompt = PROMPT_TEMPLATE.replace("{{NEWS}}", newsText);

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    max_tokens: 1500
  });

  const raw = response.choices[0]?.message?.content;
  const parsed = safeExtractJSON(raw);

  // ✅ Final fallback (NEVER FAIL)
  if (!parsed) {
    return {
      sinhalaHeading: "මෙම පුවත් සඳහා සරල සාරාංශයක් ලබා ගැනීමට නොහැකි විය",
      sriLankaImpact:
        "මෙම පුවත් ශ්‍රී ලංකාවට සෘජු හෝ පරෝක්ෂ බලපෑමක් ඇති විය හැකි නමුත්, දත්ත ප්‍රමාණය සීමිතය."
    };
  }

  return parsed;
}

