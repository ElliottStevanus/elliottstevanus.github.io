// ui.js

import { renderReadingView } from "./renderer.js";

export function setupUI(container, annotatedDoc) {

    const searchBox = document.getElementById("figure-search");
    const resultsList = document.getElementById("search-results");

    // -------------------------
    // VIEW SWITCHING
    // -------------------------

    document.getElementById("view-reading").onclick = () => {
        renderReadingView(annotatedDoc, container);
        attachSpanEvents(container);
    };

    document.getElementById("view-metaphor").onclick = () => {
        runXSLT(container, annotatedDoc);
        attachMetaphorListEvents();
    };

    document.getElementById("view-analysis").onclick = () => {
        renderAnalysisView(container, annotatedDoc);
    };

    // -------------------------
    // SEARCH (analysis view)
    // -------------------------

    searchBox.addEventListener("input", () => {

        const query = searchBox.value.toLowerCase();
        resultsList.innerHTML = "";

        if (!query) return;

        const metaphors = annotatedDoc.getElementsByTagName("metaphor");

        Array.from(metaphors).forEach(m => {

            if (m.textContent.toLowerCase().includes(query)) {

                const li = document.createElement("li");
                li.textContent = m.textContent;

                li.onclick = () => {
                    alert(m.textContent + "\n\n" + m.parentNode.textContent);
                };

                resultsList.appendChild(li);
            }
        });
    });
}

// -------------------------
// XSLT VIEW
// -------------------------

function runXSLT(container, xmlDoc) {

    const xsltText = document.getElementById("metaphor-xsl").textContent;
    const xsltDoc = new DOMParser().parseFromString(xsltText, "text/xml");

    const processor = new XSLTProcessor();
    processor.importStylesheet(xsltDoc);

    const result = processor.transformToFragment(xmlDoc, document);

    container.innerHTML = "";
    container.appendChild(result);
}

// -------------------------
// ANALYSIS VIEW
// -------------------------

function renderAnalysisView(container, xmlDoc) {

    container.innerHTML = "";

    const metaphors = xmlDoc.getElementsByTagName("metaphor");

    Array.from(metaphors).forEach(m => {

        const div = document.createElement("div");
        div.className = "analysis-item";
        div.textContent = m.textContent;

        div.onclick = () => {
            alert(m.textContent + "\n\n" + m.parentNode.textContent);
        };

        container.appendChild(div);
    });
}

// -------------------------
// EVENTS
// -------------------------

function attachSpanEvents(container) {

    container.querySelectorAll("span.metaphor, span.simile").forEach(el => {

        el.style.cursor = "pointer";

        el.onclick = () => {
            alert(el.textContent + "\n\n" + el.parentNode.textContent);
        };
    });
}

function attachMetaphorListEvents() {

    document.querySelectorAll(".metaphor-item").forEach(item => {

        item.onclick = () => {
const context = item.getAttribute("data-context");
            alert(item.textContent + "\n\n" + context);
        };
    });
}
