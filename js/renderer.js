export function runXSLT(path, xmlDoc, container) {

    fetch(path)
        .then(r => r.text())
        .then(xsltText => {

            const xsltDoc =
                new DOMParser().parseFromString(xsltText, "text/xml");

            const processor = new XSLTProcessor();
            processor.importStylesheet(xsltDoc);

            const result =
                processor.transformToFragment(xmlDoc, document);

            container.innerHTML = "";
            container.appendChild(result);
        });
}
