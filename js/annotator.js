export function annotateXML(paragraphs) {

    let xml = "<book>";

    Array.from(paragraphs).forEach((p, pIndex) => {

        const text = p.textContent;

        let tags = [];

        // -------------------------
        // SIMILES
        // -------------------------
        const simileRegex =
            /\bas\s+[^.!?]+?\s+as\s+[^.!?]+|like\s+(a|an|the)\s+[^.!?]+|as\s+if\s+[^.!?]+/gi;

        let m;
        while ((m = simileRegex.exec(text)) !== null) {
            tags.push({
                start: m.index,
                end: m.index + m[0].length,
                type: "simile"
            });
        }

        // -------------------------
        // METAPHORS (TIGHTENED)
        // -------------------------
        const triggerRegex =
            /\b(is|are|was|were|became|becomes)\s+(a|an|the)\s+/gi;

        while ((m = triggerRegex.exec(text)) !== null) {

            const clause = expandClause(text, m.index);

            const clauseText = text.slice(clause.start, clause.end);

            // optional filter: avoid tiny noise + overly large chunks
            if (clauseText.split(" ").length < 4) continue;

            tags.push({
                start: clause.start,
                end: clause.end,
                type: "metaphor"
            });
        }

        // -------------------------
        // SORT TAGS
        // -------------------------
        tags.sort((a, b) => a.start - b.start);

        // -------------------------
        // REMOVE OVERLAPS
        // -------------------------
        let filtered = [];
        let lastEnd = 0;

        for (let t of tags) {
            if (t.start >= lastEnd) {
                filtered.push(t);
                lastEnd = t.end;
            }
        }

        // -------------------------
        // BUILD OUTPUT (SAFE)
        // -------------------------
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

    // -------------------------
    // CLAUSE EXPANSION (SAFE + LIMITED)
    // -------------------------
    function expandClause(text, index) {

        const before = text.slice(0, index);
        const after = text.slice(index);

        let start = Math.max(
            before.lastIndexOf("."),
            before.lastIndexOf("!"),
            before.lastIndexOf("?")
        );

        start = start === -1 ? 0 : start + 1;

        let end = after.search(/[.!?]/);

        if (end === -1) {
            end = text.length;
        } else {
            end = index + end;
        }

        // HARD LIMIT (prevents paragraph swallowing)
        const MAX_LENGTH = 120;

        if (end - start > MAX_LENGTH) {
            end = start + MAX_LENGTH;
        }

        return { start, end };
    }

    // -------------------------
    // XML ESCAPING
    // -------------------------
    function escapeXML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    }
}
