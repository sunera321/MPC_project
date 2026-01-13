export const PROMPT_TEMPLATE = `
You are a professional news analyst.

ONLY use the provided news.
DO NOT invent facts.
Be clear and neutral.
Respond ONLY with valid JSON.

News:
{{NEWS}}

Task:
For EACH news item.:
- Explain proparly how it could affect Sri Lanka and world.
- Consider economy, politics, society, or global relations.


Return ONLY this JSON format:

{
  "newsAnalysis": [
    {
      "title": "",
      "description": "",
      "sriLankaImpact": ""
    }
  ]
}
`;

