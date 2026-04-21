const App = {
  graphCache: null,
  sentenceCache: null,
  activeWord: null
};

/* =========================
INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {

  cacheDocument();
  cacheSentences();

  initViewButtons();
  initMetaphorClicks();

});

/* =========================
CACHE FIGURATIVE LANGUAGE (UNCHANGED)
========================= */
function cacheDocument() {

  const items = document.querySelectorAll('.metaphor, .simile, .aphorism');

  App.graphCache = Array.from(items).map(el => ({
    el,
    type: el.classList[0],
    sentenceId: el.dataset.sentence,
    words: tokenize(el.textContent)
  }));

}

/* =========================
CACHE ALL SENTENCES
========================= */
function cacheSentences() {

  const sentences = document.querySelectorAll('p');

  App.sentenceCache = Array.from(sentences).map(p => {

    const words = tokenize(p.textContent);

    const hasFigurative = !!p.querySelector('.metaphor, .simile, .aphorism');

    return {
      el: p,
      words,
      hasFigurative
    };

  });

}

/* =========================
TOKENIZER
========================= */
function tokenize(text) {

  const stopwords = new Set([
    "the","and","is","in","of","a","to","but","with","for","on","into","he","who",
    "those","him","her","when","his","them","here","they","all","you","has","only",
    "that","it","can","was","if","my","there","as","i","or","this","have","had",
    "been","are","were","be","by","at","an","so","do","does","did","not"
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

/* =========================
ANALYSIS VIEW
========================= */
function openAnalysis(el) {

  const sentenceId = el.dataset.sentence;

  const paragraph = document.getElementById(sentenceId);

  if (!paragraph) return;

  showView("analysis-view");

  document.getElementById("analysis-sentence")
    .textContent = paragraph.textContent;

  buildWordPanel(paragraph.textContent);

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

      const uniqueWords = new Set(entry.words);

      uniqueWords.forEach(w => {

        if (w === word) return;

        if (!counts[w]) {
          counts[w] = {
            total: 0,
            types: new Set()
          };
        }

        counts[w].total += 1;
        counts[w].types.add(entry.type);

      });

    }

  });

  const result = {};

  Object.entries(counts).forEach(([w, data]) => {

    const typeBonus = data.types.size * 2;

    result[w] = data.total + typeBonus;

  });

  return result;

}

/* =========================
GRAPH RENDERING
========================= */
function renderGraph(word) {

  const data = computeCooccurrence(word);

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");

  const entries = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const barSpacing = 100;
  const baseOffset = 50;
  const width = baseOffset + entries.length * barSpacing;

  svg.setAttribute("width", width);
  svg.setAttribute("height", "300");

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
EXPANDED RESULT VIEW
========================= */
function openMetaphorView(wordA, wordB) {

  showView("metaphor-view");

  const results = App.sentenceCache.filter(entry =>
    entry.words.includes(wordA) &&
    entry.words.includes(wordB)
  );

  const container = document.getElementById("metaphor-results");

  container.innerHTML = "";

  results.forEach(entry => {

    const div = document.createElement("div");

    div.innerHTML = entry.el.innerHTML;

    div.style.cursor = "pointer";
    div.style.marginBottom = "12px";
    div.style.padding = "8px";

    if (entry.hasFigurative) {
      div.style.borderLeft = "4px solid gold";
      div.style.background = "rgba(255, 215, 0, 0.08)";
    }

    div.addEventListener("click", () => {

      const el = entry.el;

      showView("reading-view");

      el.scrollIntoView({ behavior: "smooth", block: "center" });

      el.style.background = "yellow";

    });

    container.appendChild(div);

  });

}
