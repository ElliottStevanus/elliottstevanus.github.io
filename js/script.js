// script.js

import { annotateXML } from "./annotator.js";
import { renderReadingView } from "./renderer.js";
import { setupUI } from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("novel-text");

    const xmlText = await fetch("Text/dorian_gray.xml").then(r => r.text());
    const xml = new DOMParser().parseFromString(xmlText, "text/xml");

    const paragraphs = xml.getElementsByTagName("paragraph");

    const patterns = [
        {
            regex: /\bas\s+.*?\s+as\s+.*?\b/gi,
            tag: "simile"
        },
        {
            regex: /\blike\s+(a|an|the)\s+.*?\b/gi,
            tag: "simile"
        },
        {
            regex: /\b(is|was|were|became)\s+(a|an|the)\s+.*?\b/gi,
            tag: "metaphor"
        }
    ];

    const annotatedXML = annotateXML(paragraphs, patterns);
    const annotatedDoc = new DOMParser().parseFromString(annotatedXML, "text/xml");

    // default view
    renderReadingView(annotatedDoc, container);

    setupUI(container, annotatedDoc);
});
