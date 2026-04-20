const App = {
  graphCache: null,
  activeWord: null
};

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {

  cacheDocument();

  initViewButtons();

  initMetaphorClicks();

});


/* =========================
   CACHE TEXT STRUCTURE (IMPORTANT)
========================= */
function cacheDocument() {

  const items = document.querySelectorAll('.metaphor, .simile, .aphorism');

  App.graphCache = Array.from(items).map(el => ({
    el,
    sentenceId: el.dataset.sentence,
    words: tokenize(el.textContent)
  }));

}


/* =========================
   TOKENIZER
========================= */ 
function tokenize(text) {

  const stopwords = new Set([
    "the","and","is","in","of","a","to","but","with","for","on","into","he","who","those","him"
    "that","it","can","was","if","my","there","as","i","or","this","have","had","been","are","were","be","by","at","an","so","do","does","did","not"
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(w => w && !stopwords.has(w));

}



/* =========================
   VIEW SWITCHING
========================= */
function showView(viewId) {

  document.querySelectorAll('.view')
    .forEach(v => v.classList.remove('active'));

  document.getElementById(viewId)
    .classList.add('active');

}


/* =========================
   VIEW BUTTONS
========================= */
function initViewButtons() {

  document.getElementById("view-reading")
    .addEventListener("click", () => showView("reading-view"));

  document.getElementById("view-analysis")
    .addEventListener("click", () => showView("analysis-view"));

  document.getElementById("view-metaphor")
    .addEventListener("click", () => showView("metaphor-view"));

}


/* =========================
   METAPHOR CLICK → ANALYSIS
========================= */
function initMetaphorClicks() {

  document.querySelectorAll('.metaphor, .simile, .aphorism')
    .forEach(el => {

      el.addEventListener("click", () => {

        openAnalysis(el);

      });

    });

}


function openAnalysis(el) {

  const sentenceId = el.dataset.sentence;

  const paragraph = document.getElementById(sentenceId);

  if (!paragraph) return;

  // switch view
  showView("analysis-view");

  // inject sentence
  document.getElementById("analysis-sentence")
    .textContent = paragraph.textContent;

  // build word panel
  buildWordPanel(paragraph.textContent);

  // scroll into view
  paragraph.scrollIntoView({ behavior: "smooth", block: "center" });

}


/* =========================
   WORD PANEL
========================= */
function buildWordPanel(text) {

  const words = tokenize(text);

  const panel = document.getElementById("word-panel");

  panel.innerHTML = "";

  words.forEach(word => {

    const btn = document.createElement("button");
    btn.textContent = word;

    btn.addEventListener("click", () => {

      App.activeWord = word;

      renderGraph(word);

    });

    panel.appendChild(btn);

  });

}


/* =========================
   CO-OCCURRENCE GRAPH
========================= */
function computeCooccurrence(word) {

  const counts = {};

  App.graphCache.forEach(entry => {

    if (entry.words.includes(word)) {

      entry.words.forEach(w => {

        if (w !== word) {
          counts[w] = (counts[w] || 0) + 1;
        }

      });

    }

  });

  return counts;

}


/* =========================
   SVG GRAPH
========================= */
function renderGraph(word) {

  const data = computeCooccurrence(word);

  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");

  svg.setAttribute("width", "600");
  svg.setAttribute("height", "300");

  const entries = Object.entries(data)
    .sort((a,b) => b[1]-a[1])
    .slice(0, 10);

  entries.forEach(([w, count], i) => {

    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", 50 + i * 100);
    rect.setAttribute("y", 250 - count * 20);
    rect.setAttribute("width", 20);
    rect.setAttribute("height", count * 20);

    rect.addEventListener("click", () => {

      openMetaphorView(word, w);

    });

    svg.appendChild(rect);

    const label = document.createElementNS(svgNS, "text");

    label.setAttribute("x", 50 + i * 100);
    label.setAttribute("y", 270);
 label.textContent = w;
    svg.appendChild(label);
  });

  const container = document.getElementById("graph-container");

  container.innerHTML = "";

  container.appendChild(svg);

}


/* =========================
   METAPHOR VIEW FILTER
========================= */
function openMetaphorView(wordA, wordB) {

  showView("metaphor-view");

  const results = App.graphCache.filter(entry =>
    entry.words.includes(wordA) &&
    entry.words.includes(wordB)
  );

  const container = document.getElementById("metaphor-results");

  container.innerHTML = "";

  results.forEach(r => {

    const div = document.createElement("div");

    div.textContent = r.el.textContent;

    div.style.cursor = "pointer";
    div.style.marginBottom = "10px";

    div.addEventListener("click", () => {

      const el = document.getElementById(r.sentenceId);

      if (el) {

        showView("reading-view");

        el.scrollIntoView({ behavior: "smooth", block: "center" });

        el.style.background = "yellow";

      }

    });

    container.appendChild(div);

  });

}
