import { fetchHeadlines } from '../../newsFetcher.js';
import { analyzeWithGroq } from '../../groqClient.js';

export async function handler(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // 1. Fetch news
    const news = await fetchHeadlines();

    // 2. AI analysis
    const analysis = await analyzeWithGroq(news);

    // 3. Response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        source: "BBC RSS",
        countryFocus: "Sri Lanka",
        lastUpdated: new Date().toISOString(),
        newsAnalysis: analysis.newsAnalysis
      })
    };
  } catch (error) {
    console.error("ERROR:", error.message);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "News analysis service failed",
        message: "Please try again later"
      })
    };
  }
}
