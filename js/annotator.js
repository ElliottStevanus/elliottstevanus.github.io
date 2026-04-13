export function annotateXML(paragraphs) {

    let xml = "<book>";

    Array.from(paragraphs).forEach(p => {

        const text = p.textContent;

        xml += "<paragraph>";

        // SIMILES (simple + safe)
        const similes = text.match(/\bas\s+[^.!?]+?\s+as\s+[^.!?]+|like\s+(a|an|the)\s+[^.!?]+|as\s+if\s+[^.!?]+/gi);

        let processed = text;

        if (similes) {
            similes.forEach((s, i) => {
                processed = processed.replace(s, `<simile>${s}</simile>`);
            });
        }

        // METAPHOR CLAUSE DETECTION
        const metaphorTriggers = /\b(is|are|was|were|became|becomes)\b/gi;

        let m;
        while ((m = metaphorTriggers.exec(text)) !== null) {

            const clause = expandClause(text, m.index);

            const clauseText = text.slice(clause.start, clause.end);

            processed = processed.replace(clauseText, `<metaphor>${clauseText}</metaphor>`);
        }

        xml += processed;
        xml += "</paragraph>";
    });

    xml += "</book>";
    return xml;
}

// -------------------------

function expandClause(text, index) {

    const before = text.slice(0, index);
    const after = text.slice(index);

    let start = Math.max(
        before.lastIndexOf("."),
        before.lastIndexOf("?"),
        before.lastIndexOf("!")
    );

    start = start === -1 ? 0 : start + 1;

    const endRel = after.search(/[.!?]/);
    const end = endRel === -1 ? text.length : index + endRel;

    return { start, end };
}
