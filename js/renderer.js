// renderer.js

export function renderXML(xmlDoc, container) {

    container.innerHTML = "";

    const paragraphs = xmlDoc.getElementsByTagName("paragraph");

    Array.from(paragraphs).forEach(p => {

        const pEl = document.createElement("p");

        // walk child nodes (text + metaphors)
        p.childNodes.forEach(node => {

            if (node.nodeType === Node.TEXT_NODE) {
                pEl.appendChild(document.createTextNode(node.textContent));
            }

            else {
                // metaphor or simile tag
                const span = document.createElement(node.nodeName);
                span.textContent = node.textContent;

                span.classList.add("highlight");

                pEl.appendChild(span);
            }
        });

        container.appendChild(pEl);
    });
}
