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

            const patterns = [
                {
                    // "as X as Y" similes (improved word safety)
                    regex: /\bas\s+[a-zA-Z'-]+(?:\s+[a-zA-Z'-]+){0,2}\s+as\s+[a-zA-Z'-]+(?:\s+[a-zA-Z'-]+){0,2}\b/gi,
                    tag: "simile"
                },

                {
                    // "like a/an/the X" (limited phrase length to reduce noise)
                    regex: /\blike\s+(?:a|an|the)\s+[a-zA-Z'-]+(?:\s+[a-zA-Z'-]+){0,3}\b/gi,
                    tag: "simile"
                },

                {
                    // extended similes with "like a/an/the X ..." but capped more strictly
                    regex: /\blike\s+(?:a|an|the)\s+[a-zA-Z'-]+(?:\s+[a-zA-Z'-]+){1,4}\b/gi,
                    tag: "simile"
                },

                {
                    // "is/was/are/becomes a X" metaphors (improved structure + prevents sentence bleed)
                    regex: /\b(?:is|are|was|were|becomes|became)\s+(?:a|an|the)\s+[a-zA-Z'-]+(?:\s+[a-zA-Z'-]+){0,2}\b/gi,
                    tag: "metaphor"
                },

                {
                    // "as if ..." similes (stops at punctuation OR line end)
                    regex: /\bas\s+if\s+[^.!?\n]+/gi,
                    tag: "simile"
                },

                {
                    // "X of Y" metaphors — restricted to reduce literal phrases like "cup of tea"
                    regex: /\b(?:heart|sea|river|storm|wave|sea|ocean|world|mountain|sea|forest|fire|sea)\s+of\s+[a-zA-Z'-]+(?:\s+[a-zA-Z'-]+){0,2}\b/gi,
                    tag: "metaphor"
                }
            ];

           let html = "";

Array.from(paragraphs).forEach(p => {

    const text = p.textContent;

    let matches = [];

    // 1. Collect all matches first (no modification yet)
    patterns.forEach(rule => {
        let m;

        while ((m = rule.regex.exec(text)) !== null) {
            matches.push({
                start: m.index,
                end: m.index + m[0].length,
                text: m[0],
                tag: rule.tag
            });
        }

        // reset regex state (important because of /g)
        rule.regex.lastIndex = 0;
    });

    // 2. Sort matches left → right
    matches.sort((a, b) => a.start - b.start);

    // 3. Remove overlaps (keep first match only)
    let filtered = [];
    let lastEnd = 0;

    for (let m of matches) {
        if (m.start >= lastEnd) {
            filtered.push(m);
            lastEnd = m.end;
        }
    }

    // 4. Rebuild string once
    let result = "";
    let cursor = 0;

    for (let m of filtered) {
        result += text.slice(cursor, m.start);
        result += `<span class="${m.tag}">${m.text}</span>`;
        cursor = m.end;
    }

    result += text.slice(cursor);

    html += `<p>${result}</p>`;
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
