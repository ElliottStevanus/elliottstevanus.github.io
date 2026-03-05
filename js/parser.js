document.addEventListener("DOMContentLoaded", function () {

    fetch("dorian_gray.xml")
        .then(response => response.text())
        .then(str => {

            const parser = new DOMParser();
            const xml = parser.parseFromString(str, "text/xml");

            const paragraphs = xml.getElementsByTagName("paragraph");

            let output = "";

            const patterns = [
                /[^.!?]*\b(?:was|were|is|are|seemed|looked|stood|moved|shone|burned|glowed|whispered|cried|laughed)\b[^.!?]*?\blike\s+(?:a|an|the)\s+\w+[^.!?]*[.!?]/gi,
                /\bas\s+\w+\s+as\s+\w+\b/gi,
                /\bas\s+if\s+[^.!?]+/gi
            ];

            for (let i = 0; i < paragraphs.length; i++) {

                let text = paragraphs[i].textContent;

                patterns.forEach(regex => {
                    text = text.replace(regex, match =>
                        `<span class="figurative-highlight">${match}</span>`
                    );
                });

                output += `<p>${text}</p>`;
            }

            document.getElementById("novel-text").innerHTML = output;
        });
});
