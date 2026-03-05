document.addEventListener("DOMContentLoaded", function () {

    fetch("Text/dorian_gray.xml")  //chatgpt helped with this. I had no idea how to do this fetch stuff in Java. Turns out it's simple
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch dorian_gray.xml: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(str => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(str, "text/xml");
            const paragraphs = xml.getElementsByTagName("paragraph"); //just to focus only on the actual text parts of the text file... this caused a lot of trouble for me and I ended up just counting everything as a paragraph so now it's useless.
            //so I should probably just get rid of it, and just go in between the novel element.

            let output = "";

            const patterns = [
                /[^.!?]*\b(?:was|were|is|are|seemed|looked|stood|moved|shone|burned|glowed|whispered|cried|laughed)\b[^.!?]*?\blike\s+(?:a|an|the)\s+\w+[^.!?]*[.!?]/gi,
                //okay so what i'm trying to do here is match all the words around like within a sentence that could be metaphor. 
                //All the verbs are my way of cheating... I don't like that I had to do this, i'll have to think of another way, this skews the results too much
                //the prepositions coming right after the word like are a better, more generic solution. 
                /\bas\s+\w+\s+as\s+\w+\b/gi, //as ___ as, it's a common way of writing simile
                /\bas\s+if\s+[^.!?]+/gi  //as if ___, a commmon way of writing metaphor
            ];

            for (let i = 0; i < paragraphs.length; i++) {
                let text = paragraphs[i].textContent;

                patterns.forEach(regex => {
                    text = text.replace(regex, match =>
                        `<span class="figurative-highlight">${match}</span>` //figurative highlight is relating back to my index.html file
                    );
                });

                output += `<p>${text}</p>`;
            }

            document.getElementById("novel-text").innerHTML = output; //finds the part of the index.html file where I want the text to be inserted. This is going to change once I figure out how to turn the text into a tree of it's own.
        })
        .catch(error => {
            console.error("Error loading XML:", error);
            document.getElementById("novel-text").innerHTML =
                "<p>Failed to load the novel text. Make sure dorian_gray.xml is in the js folder.</p>"; //I was having too much trouble with this so I decided to have an error code.
        });
});
