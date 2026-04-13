import { annotateXML } from "./annotator.js";
import { setupUI } from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("novel-text");

    // LOAD XML
    const xmlText = await fetch("Text/dorian_gray.xml").then(r => r.text());
    const xml = new DOMParser().parseFromString(xmlText, "text/xml");

    const paragraphs = xml.getElementsByTagName("paragraph");

    // ANNOTATE
    const annotatedXML = annotateXML(paragraphs);
    const annotatedDoc = new DOMParser().parseFromString(annotatedXML, "text/xml");

    // RENDER FIRST VIEW
    runXSLT("xsl/reading.xsl", annotatedDoc, container);

    // UI
    setupUI({
        container,
        annotatedDoc,
        runXSLT
    });
});


// -------------------------
// INLINE XSLT FUNCTION (replaces renderer.js)
// -------------------------
function runXSLT(path, xmlDoc, container) {

    fetch(path)
        .then(r => r.text())
        .then(xsltText => {

            const xsltDoc =
                new DOMParser().parseFromString(xsltText, "text/xml");

            const processor = new XSLTProcessor();
            processor.importStylesheet(xsltDoc);

            const result =
                processor.transformToFragment(xmlDoc, document);

            container.innerHTML = "";
            container.appendChild(result);
        });
}
