import Parser from "rss-parser";

const parser = new Parser(); // ✅ THIS WAS MISSING

export async function fetchHeadlines() {
  const feed = await parser.parseURL(
    "https://feeds.bbci.co.uk/news/business/rss.xml"
  );

  return feed.items.slice(0, 10).map(item => ({
    title: item.title || "",
    description: item.contentSnippet || item.description || ""
  }));
}

