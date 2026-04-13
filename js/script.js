document.addEventListener("DOMContentLoaded", function () {

    let figureID = 0;
    let figures = [];

    const patterns = [
        { regex: /\bas\s+[a-zA-Z'-]+\s+as\s+[a-zA-Z'-]+\b/gi, tag: "simile" },
        { regex: /\blike\s+(?:a|an|the)\s+[a-zA-Z'-]+\b/gi, tag: "simile" },
        { regex: /\blike\s+(?:a|an|the)\s+[a-zA-Z'-]+(?:\s+[a-zA-Z'-]+){0,5}/gi, tag: "simile" },
        { regex: /\b(?:was|were|is|are|became|becomes)\s+(?:a|an|the)\s+[a-zA-Z'-]+\b/gi, tag: "metaphor" },
        { regex: /\bas\s+if\s+[^.!?]+/gi, tag: "simile" },
        { regex: /\b[a-zA-Z'-]+\s+of\s+[a-zA-Z'-]+\b/gi, tag: "metaphor" }
    ];

    function normalizeText(text) {
        return text.replace(/\s+/g, " ");
    }

    //  wait until XSLT has rendered content
    function processText() {

        const paragraphs = document.querySelectorAll("#novel-text p");

        if (paragraphs.length === 0) {
            // Try again if XSLT hasn't finished yet
            setTimeout(processText, 100);
            return;
        }

        paragraphs.forEach(p => {

            let text = normalizeText(p.innerHTML);

            patterns.forEach(pattern => {
                text = text.replace(pattern.regex, match => {

                    figureID++;
                    const id = "figure-" + figureID;

                    figures.push({
                        type: pattern.tag,
                        text: match,
                        id: id
                    });

                    return `<${pattern.tag} id="${id}">${match}</${pattern.tag}>`;
                });
            });

            p.innerHTML = text;
        });

        console.log("Figures detected:", figures.length);

        setupSearch(figures);
    }

    processText();


    // search system
    function setupSearch(figures) {

        const searchBox = document.getElementById("figure-search");
        const resultsList = document.getElementById("search-results");

        if (!searchBox || !resultsList) {
            console.log("Search UI not found");
            return;
        }

        searchBox.addEventListener("input", function () {

            const query = this.value.toLowerCase();
            resultsList.innerHTML = "";

            if (query.length === 0) return;

            figures.forEach(fig => {

                if (fig.text.toLowerCase().includes(query)) {

                    const li = document.createElement("li");
                    li.textContent = fig.text;

                    li.addEventListener("click", function () {

                        const target = document.getElementById(fig.id);

                        if (target) {
                            target.scrollIntoView({
                                behavior: "smooth",
                                block: "center"
                            });
                        }

                    });

                    resultsList.appendChild(li);
                }

            });

        });
    }

});
