const container = document.getElementById("newsContainer");
const lastUpdated = document.getElementById("lastUpdated");

async function fetchNews() {
  try {
    const res = await fetch("http://64.227.169.188:3000/analyze-news");
    const data = await res.json();

    lastUpdated.textContent =
      "Last updated: " + new Date(data.lastUpdated).toLocaleString();

    container.innerHTML = ""; // Clear loading

    data.newsAnalysis.forEach(item => {
      const card = document.createElement("div");
      card.className = "news-card";

      card.innerHTML = `
        <div class="news-title">${item.title}</div>
        <div class="news-desc">${item.description}</div>
        <div class="impact-box">
          <h4>🇱🇰 Impact on Sri Lanka</h4>
          <p>${item.sriLankaImpact}</p>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = `<div class="loading">Failed to fetch news. Please try again later.</div>`;
    console.error(err);
  }
}

// Fetch news on load
fetchNews();

