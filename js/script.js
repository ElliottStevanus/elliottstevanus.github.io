document.addEventListener("DOMContentLoaded", () => {

    const searchBox = document.getElementById("figure-search");
    const resultsList = document.getElementById("search-results");
    const container = document.getElementById("novel-text");

    let indexedElements = [];

    fetch("Text/dorian_gray.xml")
        .then(res => res.text())
        .then(xmlText => {

            const xml = new DOMParser().parseFromString(xmlText, "text/xml");

            const paragraphs = xml.getElementsByTagName("paragraph");

           regex:/\bas\s+[a-zA-Z'-]+\s+as\s+[a-zA-Z'-]+\b/gi, tag:"simile" }, 
              { regex:/\blike\s+(?:a|an|the)\s+[a-zA-Z'-]+\b/gi, tag:"simile" }, 
              { regex:/\blike\s+(?:a|an|the)\s+[a-zA-Z'-]+(?:\s+[a-zA-Z'-]+){0,5}/gi, tag:"simile" }, 
              { regex:/\b(?:was|were|is|are|became|becomes)\s+(?:a|an|the)\s+[a-zA-Z'-]+\b/gi, tag:"metaphor" }, 
              { regex:/\bas\s+if\s+[^.!?]+/gi, tag:"simile" }, 
            { regex:/\b[a-zA-Z'-]+\s+of\s+[a-zA-Z'-]+\b/gi, tag:"metaphor" }
            let html = "";

            Array.from(paragraphs).forEach(p => {

                let text = p.textContent;

                patterns.forEach(rule => {
                    text = text.replace(rule.regex, match => {
                        return `<span class="${rule.type}">${match}</span>`;
                    });
                });

                html += `<p>${text}</p>`;
            });

            container.innerHTML = html;

            indexedElements = Array.from(document.querySelectorAll(".simile, .metaphor"));

            setupSearch();
        })
        .catch(err => console.error("Load error:", err));


    function setupSearch() {

        searchBox.addEventListener("input", () => {

            const query = searchBox.value.toLowerCase();
            resultsList.innerHTML = "";

            if (!query) return;

            indexedElements.forEach(el => {

                const text = el.textContent.toLowerCase();

                if (text.includes(query)) {

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
