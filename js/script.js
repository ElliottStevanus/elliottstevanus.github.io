document.addEventListener("DOMContentLoaded", function () {

    let figureID = 0;
    let figures = [];

    const parser = new DOMParser();
console.log(newDoc.documentElement.outerHTML);
    fetch("Text/dorian_gray.xml")
        .then(res => {
            if(!res.ok) throw new Error("XML load failed");
            return res.text();
        })
        .then(str => {

            const xml = parser.parseFromString(str, "text/xml");

            const paragraphs = xml.getElementsByTagName("paragraph");

            function normalizeText(text){
                return text.replace(/\s+/g," ");
            }

            function escapeXML(str){
                return str
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");
            }

            const patterns = [
                { regex:/\bas\s+[a-zA-Z'-]+\s+as\s+[a-zA-Z'-]+\b/gi, tag:"simile" },
                { regex:/\blike\s+(?:a|an|the)\s+[a-zA-Z'-]+\b/gi, tag:"simile" },
                { regex:/\blike\s+(?:a|an|the)\s+[a-zA-Z'-]+(?:\s+[a-zA-Z'-]+){0,5}/gi, tag:"simile" },
                { regex:/\b(?:was|were|is|are|became|becomes)\s+(?:a|an|the)\s+[a-zA-Z'-]+\b/gi, tag:"metaphor" },
                { regex:/\bas\s+if\s+[^.!?]+/gi, tag:"simile" },
                { regex:/\b[a-zA-Z'-]+\s+of\s+[a-zA-Z'-]+\b/gi, tag:"metaphor" }
            ];

            const newDoc = document.implementation.createDocument("", "root", null);
            const root = newDoc.documentElement;

            for(let i = 0; i < paragraphs.length; i++){

                let text = paragraphs[i].textContent;
                text = normalizeText(text);

                patterns.forEach(p => {
                    text = text.replace(p.regex, match => {

                        figureID++;
                        const id = "figure-" + figureID;

                        figures.push({
                            type: p.tag,
                            text: match,
                            id: id
                        });

                        return `<${p.tag} id="${id}">${match}</${p.tag}>`;
                    });
                });

                const safeText = escapeXML(text);

                const temp = parser.parseFromString(
                    `<paragraph>${safeText}</paragraph>`,
                    "text/xml"
                );

                const imported = newDoc.importNode(temp.documentElement, true);
                root.appendChild(imported);
            }

            console.log("Figures detected:", figures.length);

            // NOW LOAD XSLT PROPERLY
            return fetch("xslt/transform.xsl")
                .then(res => {
                    if(!res.ok) throw new Error("XSLT load failed");
                    return res.text();
                })
                .then(xslText => {

                    const xslDoc = parser.parseFromString(xslText, "text/xml");

                    const xsltProcessor = new XSLTProcessor();
                    xsltProcessor.importStylesheet(xslDoc);

                    const result = xsltProcessor.transformToFragment(newDoc, document);

                    const container = document.getElementById("novel-text");
                    container.innerHTML = "";
                    container.appendChild(result);

                    // ONLY RUN SEARCH AFTER EVERYTHING IS READY
                    setupSearch(figures);
                });

        })
        .catch(err => {
            console.error("PIPELINE ERROR:", err);
            document.getElementById("novel-text").innerHTML =
                "<p>Failed to load text.</p>";
        });

    function setupSearch(figures){

        const searchBox = document.getElementById("figure-search");
        const resultsList = document.getElementById("search-results");

        searchBox.addEventListener("input", function(){

            const query = this.value.toLowerCase();
            resultsList.innerHTML = "";

            if(query.length === 0) return;

            figures.forEach(fig => {

                if(fig.text.toLowerCase().includes(query)){

                    const li = document.createElement("li");
                    li.textContent = fig.text;

                    li.addEventListener("click", function(){

                        const target = document.getElementById(fig.id);

                        if(target){
                            target.scrollIntoView({
                                behavior:"smooth",
                                block:"center"
                            });
                        }
                    });

                    resultsList.appendChild(li);
                }
            });
        });
    }

});
