document.addEventListener("DOMContentLoaded", () => {

    const parser = new DOMParser();

    fetch("Text/dorian_gray.xml")
        .then(res => res.text())
        .then(xmlText => {

            const xml = parser.parseFromString(xmlText, "text/xml");

            console.log("XML loaded:", xml);

            return fetch("xslt/transform.xsl")
                .then(res => res.text())
                .then(xslText => {

                    const xsl = parser.parseFromString(xslText, "text/xml");

                    const xslt = new XSLTProcessor();
                    xslt.importStylesheet(xsl);

                    // ✅ xml is in the SAME scope here
                    const fragment = xslt.transformToFragment(xml, document);

                    const container = document.getElementById("novel-text");
                    container.innerHTML = "";
                    container.appendChild(fragment);

                });

        })
        .catch(err => {
            console.error("Pipeline error:", err);
        });

});
