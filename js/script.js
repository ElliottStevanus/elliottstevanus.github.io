document.addEventListener("DOMContentLoaded", function () {

    console.log("Pipeline starting...");

    const parser = new DOMParser();

    fetch("Text/dorian_gray.xml")
        .then(res => {
            if (!res.ok) throw new Error("XML load failed");
            return res.text();
        })
        .then(xmlText => {

            // =========================
            // PARSE XML (NO REBUILDING)
            // =========================
            const xml = parser.parseFromString(xmlText, "text/xml");

            console.log("XML loaded");

            // =========================
            // APPLY REGEX DIRECTLY INTO XML NODES
            // (SAFE NODE MANIPULATION)
            // =========================
            const paragraphs = xml.getElementsByTagName("paragraph");

            let figureID = 0;

            const patterns = [
                { regex: /\bas\s+[a-zA-Z'-]+\s+as\s+[a-zA-Z'-]+/gi, tag: "simile" },
                { regex: /\blike\s+(?:a|an|the)\s+[a-zA-Z'-]+/gi, tag: "simile" },
                { regex: /\b(?:was|were|is|are|became|becomes)\s+(?:a|an|the)\s+[a-zA-Z'-]+/gi, tag: "metaphor" },
                { regex: /\bas\s+if\s+[^.!?]+/gi, tag: "simile" }
            ];
console.log("SIMILES IN XML:", xml.getElementsByTagName("simile").length);
console.log("METAPHORS IN XML:", xml.getElementsByTagName("metaphor").length);
            
            // Convert NodeList safely
            Array.from(paragraphs).forEach(p => {

                let text = p.textContent;

                // Replace paragraph content with safe HTML string
                patterns.forEach(rule => {

                    text = text.replace(rule.regex, match => {

                        figureID++;

                        return `<${rule.tag} class="${rule.tag}" id="fig-${figureID}">${match}</${rule.tag}>`;
                    });
                });

                // IMPORTANT: inject as HTML inside paragraph
                p.innerHTML = text;
            });

            console.log("Regex annotation complete");

            // =========================
            // APPLY XSLT
            // =========================
            return fetch("xslt/transform.xsl")
                .then(res => {
                    if (!res.ok) throw new Error("XSLT load failed");
                    return res.text();
                })
                .then(xslText => {

                    const xslDoc = parser.parseFromString(xslText, "text/xml");

                    const xslt = new XSLTProcessor();
                    xslt.importStylesheet(xslDoc);

                    const result = xslt.transformToFragment(xml, document);

                    const container = document.getElementById("novel-text");
                    container.innerHTML = "";
                    container.appendChild(result);

                    console.log("XSLT render complete");

                    setupSearch();
                });

        })
        .catch(err => {
            console.error("Pipeline error:", err);
        });

    // =========================
    // SEARCH SYSTEM
    // =========================
    function setupSearch() {

        const searchBox = document.getElementById("figure-search");
        const resultsList = document.getElementById("search-results");

        if (!searchBox || !resultsList) {
            console.warn("Search UI missing");
            return;
        }

        searchBox.addEventListener("input", function () {

            const query = this.value.toLowerCase();
            resultsList.innerHTML = "";

            if (!query) return;

            const items = document.querySelectorAll(".simile, .metaphor");

            items.forEach(el => {

                const text = el.textContent;

                if (text.toLowerCase().includes(query)) {

                    const li = document.createElement("li");
                    li.textContent = text;

                    li.addEventListener("click", () => {

                        el.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                        el.style.background = "yellow";
                        setTimeout(() => el.style.background = "", 800);
                    });

                    resultsList.appendChild(li);
                }
            });
        });
    }

});
