import { annotateXML } from "./annotator.js";

document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("novel-text");

    const xmlText = await fetch("Text/dorian_gray.xml").then(r => r.text());
    const xml = new DOMParser().parseFromString(xmlText, "text/xml");

    const paragraphs = xml.getElementsByTagName("paragraph");

    // STEP 1: annotate
    const annotatedXML = annotateXML(paragraphs);
    const annotatedDoc = new DOMParser().parseFromString(annotatedXML, "text/xml");

    // default view
    runXSLT("xsl/reading.xsl", annotatedDoc, container);

    // UI buttons
    document.getElementById("view-reading").onclick = () =>
        runXSLT("xsl/reading.xsl", annotatedDoc, container);

    document.getElementById("view-metaphor").onclick = () =>
        runXSLT("xsl/metaphor.xsl", annotatedDoc, container);

    document.getElementById("view-analysis").onclick = () =>
        runXSLT("xsl/analysis.xsl", annotatedDoc, container);
});

// -------------------------

function runXSLT(path, xmlDoc, container) {

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
