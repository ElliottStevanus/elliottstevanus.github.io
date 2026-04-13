import { annotateXML } from "./annotator.js";
import { setupUI } from "./ui.js";
import { runXSLT } from "./renderer.js";

document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("novel-text");

    // 1. LOAD XML
    const xmlText = await fetch("Text/dorian_gray.xml").then(r => r.text());
    const xml = new DOMParser().parseFromString(xmlText, "text/xml");

    const paragraphs = xml.getElementsByTagName("paragraph");

    // 2. ANNOTATE
    const annotatedXML = annotateXML(paragraphs);
    const annotatedDoc = new DOMParser().parseFromString(annotatedXML, "text/xml");

    console.log("✔ Annotated XML ready");

    // 3. INITIAL RENDER
    runXSLT("xsl/reading.xsl", annotatedDoc, container);

    // 4. UI INITIALISATION (PASS EVERYTHING CLEANLY)
    setupUI({
        container,
        annotatedDoc,
        runXSLT
    });
});
