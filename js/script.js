import { annotateXML } from "./annotator.js";
import { setupUI } from "./ui.js";

// Wait until the HTML document is fully loaded before running any logic
document.addEventListener("DOMContentLoaded", async () => {

    // Get the DOM element where the final rendered text will be inserted
    const container = document.getElementById("novel-text");

    // -------------------------
    // LOAD RAW XML FILE
    // -------------------------
    // Fetch the XML file from disk/server as plain text
    const xmlText = await fetch("Text/dorian_gray.xml").then(r => r.text());

    // Convert raw XML string into a structured XML DOM object
    const xml = new DOMParser().parseFromString(xmlText, "text/xml");

    // Extract all <paragraph> elements from the XML document
    // This returns a live NodeList of paragraph nodes
    const paragraphs = xml.getElementsByTagName("paragraph");

    // -------------------------
    // ANNOTATION STEP (CORE NLP PIPELINE STAGE)
    // -------------------------
    // Pass raw paragraphs into custom annotation engine
    // This function:
    // - detects similes and metaphors
    // - wraps them in <simile> / <metaphor> tags
    // - returns a NEW XML string with added structure
    const annotatedXML = annotateXML(paragraphs);

    // Convert annotated XML string back into a DOM object
    // This is required so XSLT can process it structurally
    const annotatedDoc = new DOMParser().parseFromString(annotatedXML, "text/xml");

    // -------------------------
    // INITIAL RENDER (DEFAULT VIEW)
    // -------------------------
    // Apply XSL transformation to convert XML → styled HTML
    // This produces the first visible reading view in the browser
    runXSLT("xsl/reading.xsl", annotatedDoc, container);

    // -------------------------
    // UI INITIALIZATION
    // -------------------------
    // Setup interactive UI controls (likely toggles, filters, etc.)
    // Pass shared state so UI can:
    // - re-run XSLT transformations
    // - access annotated XML
    // - update rendering dynamically
    setupUI({
        container,
        annotatedDoc,
        runXSLT
    });
});


// =========================================================
// INLINE XSLT RENDERING ENGINE
// (replaces separate renderer module)
// =========================================================

function runXSLT(path, xmlDoc, container) {

    // Fetch the XSLT stylesheet file (XML-based transformation rules)
    fetch(path)
        .then(r => r.text()) // convert response into raw string
        .then(xsltText => {

            // Parse XSLT string into an XML document
            // This is required because XSLTProcessor expects a DOM object
            const xsltDoc =
                new DOMParser().parseFromString(xsltText, "text/xml");

            // Create an XSLT processor (browser built-in engine)
            const processor = new XSLTProcessor();

            // Load the XSLT stylesheet into the processor
            processor.importStylesheet(xsltDoc);

            // Transform the XML document into an HTML fragment
            // This applies all XSLT rules (templates, loops, etc.)
            const result =
                processor.transformToFragment(xmlDoc, document);

            // Clear any previous rendered content
            container.innerHTML = "";

            // Insert the newly generated HTML into the page
            container.appendChild(result);
        });
}
