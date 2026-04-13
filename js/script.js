document.addEventListener("DOMContentLoaded", function () {

    const parser = new DOMParser();

    window.addEventListener("load", function () {

        console.log("Starting pipeline...");

        fetch("Text/dorian_gray.xml")
            .then(res => {
                if (!res.ok) throw new Error("XML load failed");
                return res.text();
            })
            .then(xmlText => {

                const xml = parser.parseFromString(xmlText, "text/xml");
                const paragraphs = xml.getElementsByTagName("paragraph");

                let newDoc = document.implementation.createDocument("", "root", null);
                const root = newDoc.documentElement;

                let figureID = 0;

                const patterns = [
                    { regex: /\bas\s+[a-zA-Z'-]+\s+as\s+[a-zA-Z'-]+/gi, tag: "simile" },
                    { regex: /\blike\s+(?:a|an|the)\s+[a-zA-Z'-]+/gi, tag: "simile" },
                    { regex: /\b(?:was|were|is|are|became|becomes)\s+(?:a|an|the)\s+[a-zA-Z'-]+/gi, tag: "metaphor" },
                    { regex: /\bas\s+if\s+[^.!?]+/gi, tag: "simile" }
                ];

                for (let p of paragraphs) {

                    let text = p.textContent.replace(/\s+/g, " ");

                    patterns.forEach(rule => {
                        text = text.replace(rule.regex, match => {

                            figureID++;
                            return `<${rule.tag} id="fig-${figureID}">${match}</${rule.tag}>`;

                        });
                    });

                    const temp = parser.parseFromString(
                        `<paragraph>${escapeXML(text)}</paragraph>`,
                        "text/xml"
                    );

                    root.appendChild(newDoc.importNode(temp.documentElement, true));
                }

                console.log("Regex annotation complete");

                return fetch("xslt/transform.xsl")
                    .then(res => res.text())
                    .then(xslText => {

                        const xslDoc = parser.parseFromString(xslText, "text/xml");

                        const xslt = new XSLTProcessor();
                        xslt.importStylesheet(xslDoc);

                        const result = xslt.transformToFragment(newDoc, document);

                        document.getElementById("novel-text").innerHTML = "";
                        document.getElementById("novel-text").appendChild(result);

                        setupSearch();
                    });

            })
            .catch(err => {
                console.error("Pipeline error:", err);
            });
    });

    // =========================
    // SEARCH (runs AFTER XSLT)
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

            const items = document.querySelectorAll("simile, metaphor, .simile, .metaphor");

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

    // =========================
    // XML ESCAPE HELPER
    // =========================
    function escapeXML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

});
