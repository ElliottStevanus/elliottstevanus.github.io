export function setupUI({ container, annotatedDoc, runXSLT }) {

    const searchBox = document.getElementById("figure-search");
    const resultsList = document.getElementById("search-results");

    // -------------------------
    // VIEW BUTTONS
    // -------------------------

    document.getElementById("view-reading").onclick = () =>
        runXSLT("xsl/reading.xsl", annotatedDoc, container);

    document.getElementById("view-metaphor").onclick = () =>
        runXSLT("xsl/metaphor.xsl", annotatedDoc, container);

    document.getElementById("view-analysis").onclick = () =>
        runXSLT("xsl/analysis.xsl", annotatedDoc, container);

    // -------------------------
    // SEARCH
    // -------------------------

    searchBox.addEventListener("input", () => {

        const query = searchBox.value.toLowerCase();
        resultsList.innerHTML = "";

        if (!query) return;

        const metaphors = annotatedDoc.getElementsByTagName("metaphor");

        Array.from(metaphors).forEach(m => {

            if (m.textContent.toLowerCase().includes(query)) {

                const li = document.createElement("li");
                li.textContent = m.textContent;

                li.onclick = () => {
                    alert(
                        m.textContent +
                        "\n\n" +
                        (m.parentNode?.textContent || "")
                    );
                };

                resultsList.appendChild(li);
            }
        });
    });
}
