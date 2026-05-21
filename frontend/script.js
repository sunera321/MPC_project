const container = document.getElementById("newsContainer");
const lastUpdated = document.getElementById("lastUpdated");
const newsCount = document.getElementById("newsCount");
const updateTimer = document.getElementById("updateTimer");
const refreshBtn = document.getElementById("refreshBtn");
const viewButtons = document.querySelectorAll(".view-btn");

const API_ENDPOINTS = ["/api/analyze-news", "/analyze-news"];
const UPDATE_INTERVAL = 60 * 60 * 1000; // 1 hour

let countdownInterval;
let nextUpdateTime;

async function fetchNewsAnalysis() {
  let lastError;

  for (const endpoint of API_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        headers: {
          Accept: "application/json"
        }
      });

      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const payload = isJson ? await res.json() : await res.text();

      if (!res.ok) {
        const message =
          isJson && payload?.message
            ? payload.message
            : `Request failed with status ${res.status}`;
        throw new Error(message);
      }

      if (!isJson || !Array.isArray(payload?.newsAnalysis)) {
        throw new Error(`Invalid response from ${endpoint}`);
      }

      return payload;
    } catch (error) {
      lastError = error;
      console.warn(`News fetch failed for ${endpoint}:`, error);
    }
  }

  throw lastError || new Error("Unable to load news analysis");
}

async function fetchNews() {
  try {
    refreshBtn.disabled = true;
    refreshBtn.style.opacity = "0.6";

    const data = await fetchNewsAnalysis();

    // Update stats
    newsCount.textContent = data.newsAnalysis.length;

    const updateTime = new Date(data.lastUpdated || Date.now());
    const formattedTime = updateTime.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    lastUpdated.textContent = formattedTime;

    // Set next update time
    nextUpdateTime = Date.now() + UPDATE_INTERVAL;
    updateCountdown();

    // Clear loading with fade effect
    container.style.opacity = "0";
    setTimeout(() => {
      container.innerHTML = "";

      // Create news cards with staggered animation
      data.newsAnalysis.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "news-card";
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
          <div class="news-title">${escapeHtml(item.title)}</div>
          <div class="news-desc">${escapeHtml(item.description)}</div>
          <div class="impact-box">
            <h4>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
              🇱🇰 Impact on Sri Lanka
            </h4>
            <p>${escapeHtml(item.sriLankaImpact)}</p>
          </div>
        `;

        container.appendChild(card);
      });

      container.style.opacity = "1";
    }, 300);

    refreshBtn.disabled = false;
    refreshBtn.style.opacity = "1";
  } catch (err) {
    container.innerHTML = `
      <div class="loading">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#8B1538">
          <circle cx="12" cy="12" r="10" stroke-width="2"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke-width="2"/>
          <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2"/>
        </svg>
        <p>දෝෂයක් ඇති විය</p>
        <p class="loading-subtitle">Failed to fetch news. Please try again later.</p>
      </div>
    `;
    console.error(err);
    refreshBtn.disabled = false;
    refreshBtn.style.opacity = "1";
  }
}

// Countdown timer for next update
function updateCountdown() {
  clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    const now = Date.now();
    const remaining = Math.max(0, nextUpdateTime - now);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    updateTimer.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, 1000);
}

// Helper function to escape HTML and prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Refresh button handler
refreshBtn.addEventListener("click", () => {
  fetchNews();
});

// View toggle handler
viewButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    viewButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const view = btn.dataset.view;
    if (view === "list") {
      container.classList.add("list-view");
    } else {
      container.classList.remove("list-view");
    }
  });
});

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = "smooth";

// Add transition to container
container.style.transition = "opacity 0.3s ease-in-out";

// Initial fetch
fetchNews();

// Auto-refresh every hour
setInterval(fetchNews, UPDATE_INTERVAL);
