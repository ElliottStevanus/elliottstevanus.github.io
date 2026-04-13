export function annotateXML(paragraphs) {

    let xml = "<book>";

    Array.from(paragraphs).forEach((p, pIndex) => {

        const text = p.textContent;

        let tags = [];

        // SIMILES
        const simileRegex =
            /\bas\s+[^.!?]+?\s+as\s+[^.!?]+|like\s+(a|an|the)\s+[^.!?]+|as\s+if\s+[^.!?]+/gi;

        let m;
        while ((m = simileRegex.exec(text)) !== null) {
            tags.push({ start: m.index, end: m.index + m[0].length, type: "simile" });
        }

        // METAPHORS
        const triggerRegex = /\b(is|are|was|were|became|becomes)\b/gi;

        while ((m = triggerRegex.exec(text)) !== null) {
            const clause = expandClause(text, m.index);
            tags.push({ start: clause.start, end: clause.end, type: "metaphor" });
        }

        // SORT
        tags.sort((a, b) => a.start - b.start);

        // REMOVE OVERLAPS
        let filtered = [];
        let lastEnd = 0;

        for (let t of tags) {
            if (t.start >= lastEnd) {
                filtered.push(t);
                lastEnd = t.end;
            }
        }

        // 🟢 SINGLE PASS BUILD (NO replace!)
        let result = "";
        let cursor = 0;

        for (let t of filtered) {

            result += escapeXML(text.slice(cursor, t.start));

            result += `<${t.type}>` +
                       escapeXML(text.slice(t.start, t.end)) +
                       `</${t.type}>`;

            cursor = t.end;
        }

        result += escapeXML(text.slice(cursor));

        xml += `<paragraph id="p${pIndex}">${result}</paragraph>`;
    });

    xml += "</book>";
    return xml;
}
