// annotator.js

export function annotateXML(paragraphs) {

    let annotatedXML = "<book>";

    Array.from(paragraphs).forEach(p => {

        const text = p.textContent;

        let matches = [];

        // ----------------------------
        // 1. SIMILES (still regex-based)
        // ----------------------------

        const similePatterns = [
            /\bas\s+[^.!?]+?\s+as\s+[^.!?]+/gi,
            /\blike\s+(?:a|an|the)\s+[^.!?]+/gi,
            /\bas\s+if\s+[^.!?]+/gi
        ];

        similePatterns.forEach(regex => {

            let m;
            while ((m = regex.exec(text)) !== null) {
                matches.push({
                    start: m.index,
                    end: m.index + m[0].length,
                    text: m[0],
                    tag: "simile"
                });
            }
        });

        // ----------------------------
        // 2. METAPHORS (CLAUSE DETECTION)
        // ----------------------------

        const triggerRegex = /\b(is|are|was|were|became|becomes|like)\b/gi;

        let m;
        while ((m = triggerRegex.exec(text)) !== null) {

            const clause = expandToClause(text, m.index);

            matches.push({
                start: clause.start,
                end: clause.end,
                text: text.slice(clause.start, clause.end),
                tag: "metaphor"
            });
        }

        // ----------------------------
        // 3. SORT + REMOVE OVERLAPS
        // ----------------------------

        matches.sort((a, b) => a.start - b.start);

        let filtered = [];
        let lastEnd = 0;

        for (let match of matches) {
            if (match.start >= lastEnd) {
                filtered.push(match);
                lastEnd = match.end;
            }
        }

        // ----------------------------
        // 4. BUILD XML OUTPUT
        // ----------------------------

        annotatedXML += "<paragraph>";

        let cursor = 0;

        filtered.forEach(m => {

            annotatedXML += escapeXML(text.slice(cursor, m.start));
            annotatedXML += `<${m.tag}>${escapeXML(m.text)}</${m.tag}>`;
            cursor = m.end;
        });

        annotatedXML += escapeXML(text.slice(cursor));
        annotatedXML += "</paragraph>";
    });

    annotatedXML += "</book>";
    return annotatedXML;
}

// ----------------------------
// CLAUSE EXPANSION ENGINE
// ----------------------------

function expandToClause(text, index) {

    // find start of sentence
    const before = text.slice(0, index);
    const after = text.slice(index);

    let start = before.lastIndexOf(".");
    let q = before.lastIndexOf("?");
    let e = before.lastIndexOf("!");

    start = Math.max(start, q, e);

    start = start === -1 ? 0 : start + 1;

    // find end of sentence
    const endPeriod = after.search(/[.!?]/);

    const end = endPeriod === -1 ? text.length : index + endPeriod;

    return { start, end };
}

// ----------------------------

function escapeXML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
