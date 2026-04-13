import { annotateXML } from "./annotator.js";
import { setupUI } from "./ui.js";

console.log(annotatedXML);

document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("novel-text");

    const xmlText = await fetch("Text/dorian_gray.xml").then(r => r.text());
    const xml = new DOMParser().parseFromString(xmlText, "text/xml");

    const paragraphs = xml.getElementsByTagName("paragraph");

    const annotatedXML = annotateXML(paragraphs);
    const annotatedDoc = new DOMParser().parseFromString(annotatedXML, "text/xml");

    // initial render
    renderView("xsl/reading.xsl", annotatedDoc, container);

    // setup UI ONCE (but it will need re-binding after each render)
    setupUI(container, annotatedDoc, renderView);

    // buttons
    document.getElementById("view-reading").onclick = () =>
        renderView("xsl/reading.xsl", annotatedDoc, container);

    document.getElementById("view-metaphor").onclick = () =>
        renderView("xsl/metaphor.xsl", annotatedDoc, container);

    document.getElementById("view-analysis").onclick = () =>
        renderView("xsl/analysis.xsl", annotatedDoc, container);
});

// -------------------------

function renderView(path, xmlDoc, container) {

    fetch(path)
        .then(r => r.text())
        .then(xsltText => {

            const xsltDoc = new DOMParser().parseFromString(xsltText, "text/xml");

            const processor = new XSLTProcessor();
            processor.importStylesheet(xsltDoc);

            const result = processor.transformToFragment(xmlDoc, document);

            container.innerHTML = "";
            container.appendChild(result);
        });
}
