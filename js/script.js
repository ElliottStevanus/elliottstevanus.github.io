document.addEventListener("DOMContentLoaded", function () {

    let figureID = 0;
    let figures = [];

    fetch("Text/dorian_gray.xml")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch dorian_gray.xml: ${response.status}`);
            }
            return response.text();
        })
        .then(str => {

            const parser = new DOMParser();
            const xml = parser.parseFromString(str, "text/xml");

            const paragraphs = xml.getElementsByTagName("paragraph");

            let output = "";

            function normalizeText(text){
                return text.replace(/\s+/g," ");
            }

            const patterns = [

                { regex:/\bas\s+[a-zA-Z'-]+\s+as\s+[a-zA-Z'-]+\b/gi, tag:"simile" },

                { regex:/\blike\s+(?:a|an|the)\s+[a-zA-Z'-]+\b/gi, tag:"simile" },

                { regex:/\blike\s+(?:a|an|the)\s+[a-zA-Z'-]+(?:\s+[a-zA-Z'-]+){0,5}/gi, tag:"simile" },

                { regex:/\b(?:was|were|is|are|became|becomes)\s+(?:a|an|the)\s+[a-zA-Z'-]+\b/gi, tag:"metaphor" },

                { regex:/\bas\s+if\s+[^.!?]+/gi, tag:"simile" },

                { regex:/\b[a-zA-Z'-]+\s+of\s+[a-zA-Z'-]+\b/gi, tag:"metaphor" }

            ];

            for(let i=0;i<paragraphs.length;i++){

                let text = paragraphs[i].textContent;
                text = normalizeText(text);

                patterns.forEach(p => {

                    text = text.replace(p.regex, match => {

                        figureID++;

                        const id = "figure-" + figureID;

                        figures.push({
                            type:p.tag,
                            text:match,
                            id:id
                        });

                        return `<${p.tag} id="${id}">${match}</${p.tag}>`;

                    });

                });

output += `<p>${text}</p>`;
            }

            document.getElementById("novel-text").innerHTML = output;

            console.log("Figures detected:", figures.length);

            setupSearch(figures);

        })
        .catch(error => {

            console.error("Error loading XML:",error);

            document.getElementById("novel-text").innerHTML =
            "<p>Failed to load the novel text.</p>";

        });


    function setupSearch(figures){

        const searchBox = document.getElementById("figure-search");
        const resultsList = document.getElementById("search-results");

        if(!searchBox || !resultsList){
            console.log("Search elements not found.");
            return;
        }

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
