import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import { fetchHeadlines } from "./newsFetcher.js";
import { analyzeWithGroq } from "./groqClient.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
/**
 * GET /analyze-news
 * Fetches BBC RSS news and explains Sri Lanka impact per news item
 */
app.get("/analyze-news", async (req, res) => {
  try {
    // 1. Fetch news (title + description)
    const news = await fetchHeadlines();

    // 2. AI analysis (per news item)
    const analysis = await analyzeWithGroq(news);

    // 3. Public-safe response
    res.json({
      source: "BBC RSS",
      countryFocus: "Sri Lanka",
      lastUpdated: new Date().toISOString(),
      newsAnalysis: analysis.newsAnalysis
    });
  } catch (error) {
    console.error("ERROR:", error.message);

    res.status(500).json({
      error: "News analysis service failed",
      message: "Please try again later"
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

