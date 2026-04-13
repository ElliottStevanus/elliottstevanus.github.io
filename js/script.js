document.addEventListener("DOMContentLoaded", function () {

    const parser = new DOMParser();

    fetch("Text/dorian_gray.xml")
        .then(res => res.text())
        .then(xmlText => {

            
            const xml = parser.parseFromString(xmlText, "text/xml");

            return fetch("xslt/transform.xsl")
                .then(res => res.text())
                .then(xslText => {

                    const xslDoc = parser.parseFromString(xslText, "text/xml");

                    const xslt = new XSLTProcessor();
                    xslt.importStylesheet(xslDoc);

                    const fragment = xslt.transformToFragment(xml, document);

                    const container = document.getElementById("novel-text");
                    container.innerHTML = "";
                    container.appendChild(fragment);

                    // 🔥 NOW DO REGEX ON FINAL HTML (NOT XML)
                    annotateFigurativeLanguage(container);

                    setupSearch();
                });
        })
        .catch(console.error);


    function annotateFigurativeLanguage(root) {

        const patterns = [
            { regex: /\bas\s+[a-zA-Z'-]+\s+as\s+[a-zA-Z'-]+/gi, tag: "simile" },
            { regex: /\blike\s+(?:a|an|the)\s+[a-zA-Z'-]+/gi, tag: "simile" },
            { regex: /\b(?:was|were|is|are|became|becomes)\s+(?:a|an|the)\s+[a-zA-Z'-]+/gi, tag: "metaphor" },
            { regex: /\bas\s+if\s+[^.!?]+/gi, tag: "simile" }
        ];

        const paragraphs = root.querySelectorAll("p");

        paragraphs.forEach(p => {

            let html = p.innerHTML;

            patterns.forEach(rule => {

                html = html.replace(rule.regex, match => {
                    return `<span class="${rule.tag}">${match}</span>`;
                });
            });

            p.innerHTML = html;
        });
    }


    function setupSearch() {

        const searchBox = document.getElementById("figure-search");
        const resultsList = document.getElementById("search-results");

        searchBox.addEventListener("input", function () {

            const query = this.value.toLowerCase();
            resultsList.innerHTML = "";

            if (!query) return;

            const items = document.querySelectorAll(".simile, .metaphor");

            items.forEach(el => {

                if (el.textContent.toLowerCase().includes(query)) {

                    const li = document.createElement("li");
                    li.textContent = el.textContent;

                    li.addEventListener("click", () => {
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                        el.style.background = "yellow";
                        setTimeout(() => el.style.background = "", 800);
                    });

                    resultsList.appendChild(li);
                }
            });
        });
    }

});
