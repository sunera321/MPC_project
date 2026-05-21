import Groq from "groq-sdk";
import { PROMPT_TEMPLATE } from "./prompt.js";
import dotenv from "dotenv";

dotenv.config();

const FALLBACK_IMPACT =
  "This development could affect Sri Lanka indirectly through trade, prices, external demand, investor sentiment, or policy spillovers, but the model could not produce a more specific structured analysis for this item.";

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

function normalizeAnalysis(news, parsed) {
  if (!Array.isArray(parsed?.newsAnalysis)) {
    return {
      newsAnalysis: news.map(item => ({
        title: item.title,
        description: item.description,
        sriLankaImpact: FALLBACK_IMPACT
      }))
    };
  }

  return {
    newsAnalysis: news.map((item, index) => {
      const analysisItem = parsed.newsAnalysis[index] ?? {};

      return {
        title: analysisItem.title || item.title,
        description: analysisItem.description || item.description,
        sriLankaImpact: analysisItem.sriLankaImpact || FALLBACK_IMPACT
      };
    })
  };
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

  return normalizeAnalysis(news, parsed);
}
