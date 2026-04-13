// renderer.js

export function renderReadingView(xmlDoc, container) {

    container.innerHTML = "";

    const paragraphs = xmlDoc.getElementsByTagName("paragraph");

    Array.from(paragraphs).forEach(p => {

        const pEl = document.createElement("p");

        p.childNodes.forEach(node => {

            if (node.nodeType === Node.TEXT_NODE) {
                pEl.appendChild(document.createTextNode(node.textContent));
            } else {

                const span = document.createElement("span");
                span.textContent = node.textContent;
                span.className = node.nodeName; // metaphor / simile

                pEl.appendChild(span);
            }
        });

        container.appendChild(pEl);
    });
}
