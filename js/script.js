import { annotateXML } from "./annotator.js";
import { renderXML } from "./renderer.js";
import { setupUI } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("novel-text");

    const patterns = [
        {
            regex: /\bas\s+[a-zA-Z'-]+(?:\s+[a-zA-Z'-]+){0,2}\s+as\s+[a-zA-Z'-]+(?:\s+[a-zA-Z'-]+){0,2}\b/gi,
            tag: "simile"
        },
        {
            regex: /\blike\s+(?:a|an|the)\s+[a-zA-Z'-]+(?:\s+[a-zA-Z'-]+){0,3}\b/gi,
            tag: "simile"
        },
        {
            regex: /\b(?:is|are|was|were|becomes|became)\s+(?:a|an|the)\s+[a-zA-Z'-]+(?:\s+[a-zA-Z'-]+){0,2}\b/gi,
            tag: "metaphor"
        }
    ];

    fetch("Text/dorian_gray.xml")
        .then(res => res.text())
        .then(xmlText => {

            const xml = new DOMParser().parseFromString(xmlText, "text/xml");
            const paragraphs = xml.getElementsByTagName("paragraph");

            // 1. annotate
            const annotated = annotateXML(paragraphs, patterns);

            // 2. parse XML
            const annotatedDoc =
                new DOMParser().parseFromString(annotated, "text/xml");

            // 3. render
            renderXML(annotatedDoc, container);

            // 4. UI
            setupUI(container);
        });
});
