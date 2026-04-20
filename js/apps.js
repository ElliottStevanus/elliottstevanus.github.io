/* =========================
   GLOBAL STATE
========================= */
const App = {
  graphCache: null,
  activeWord: null
};


/* =========================
   UTILS (becomes utils.js)
========================= */
const Utils = {

  tokenize(text) {
    const stopwords = new Set([
      "the","and","is","in","of","a","to","but","with","for","on","into"
    ]);

    return text
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(w => w && !stopwords.has(w));
  }

};


/* =========================
   READING MODULE (reading.js)
========================= */
const ReadingModule = {

  init() {
    document.querySelectorAll('.metaphor, .simile, .aphorism')
      .forEach(el => {
        el.addEventListener('click', () => {
          AnalysisModule.open(el);
        });
      });
  }

};


/* =========================
   ANALYSIS MODULE (analysis.js)
========================= */
const AnalysisModule = {

  open(el) {
    const sentenceId = el.dataset.sentence;
    const paragraph = document.getElementById(sentenceId);

    NavigationModule.showView("analysis-view");

    document.getElementById("analysis-sentence").textContent =
      paragraph.textContent;

    WordModule.buildPanel(paragraph.textContent);

    paragraph.scrollIntoView({ behavior: "smooth" });
  }

};


/* =========================
   WORD MODULE (word interaction)
========================= */
const WordModule = {

  buildPanel(text) {
    const words = Utils.tokenize(text);
    const container = document.getElementById("word-panel");

    container.innerHTML = '';

    words.forEach(word => {
      const btn = document.createElement("button");
      btn.textContent = word;

      btn.onclick = () => {
        App.activeWord = word;
        GraphModule.render(word);
      };

      container.appendChild(btn);
    });
  }

};


/* =========================
   GRAPH MODULE (graph.js)
========================= */
const GraphModule = {

  buildCache() {
    const items = document.querySelectorAll('.metaphor, .simile, .aphorism');

    App.graphCache = [...items].map(el => ({
      el,
      sentenceId: el.dataset.sentence,
      words: Utils.tokenize(el.textContent)
    }));
  },

  compute(word) {
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
  },

  render(word) {
    const data = this.compute(word);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 600);
    svg.setAttribute("height", 300);

    Object.entries(data)
      .sort((a,b) => b[1]-a[1])
      .slice(0,10)
      .forEach(([w, count], i) => {

        const rect = document.createElementNS(svg.namespaceURI, "rect");
        rect.setAttribute("x", 50 + i * 50);
        rect.setAttribute("y", 250 - count * 20);
        rect.setAttribute("width", 20);
        rect.setAttribute("height", count * 20);

        rect.addEventListener("click", () => {
          MetaphorModule.open(App.activeWord, w);
        });

        svg.appendChild(rect);

      });

    const container = document.getElementById("graph-container");
    container.innerHTML = '';
    container.appendChild(svg);
  }

};


/* =========================
   METAPHOR MODULE (metaphor.js)
========================= */
const MetaphorModule = {

  open(wordA, wordB) {
    NavigationModule.showView("metaphor-view");

    const results = App.graphCache.filter(entry =>
      entry.words.includes(wordA) &&
      entry.words.includes(wordB)
    );

    const container = document.getElementById("metaphor-results");
    container.innerHTML = '';

    results.forEach(r => {
      const div = document.createElement("div");
      div.textContent = r.el.textContent;

      div.onclick = () => {
        NavigationModule.jumpTo(r.sentenceId);
      };

      container.appendChild(div);
    });
  }

};


/* =========================
   NAVIGATION MODULE (navigation.js)
========================= */
const NavigationModule = {

  showView(viewId) {
    ["reading-view","analysis-view","metaphor-view"]
      .forEach(id => document.getElementById(id).style.display = "none");

    document.getElementById(viewId).style.display = "block";
  },

  jumpTo(id) {
    this.showView("reading-view");

    const el = document.getElementById(id);
    el.scrollIntoView({ behavior: "smooth" });

    el.style.background = "yellow";
  }

};


/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {

  GraphModule.buildCache();
  ReadingModule.init();

});
