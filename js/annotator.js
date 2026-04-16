export function annotateXML(paragraphs) {
//Tags text dynamically with simile/metaphor tags
    let xml = "<book>";

    Array.from(paragraphs).forEach((p, pIndex) => {

        const text = p.textContent;
        let tags = [];

       
            // as ... as ...
          //  like a/an/the ...
            //  "as if ..."
        const simileRegex =
/\b(as\s+[^.!?]+?\s+as\s+[^.!?]+|like\s+(a|an|the)\s+[^.!?]+|as\s+if\s+[^.!?]+)/gi;
          
          

        let m;
        // Scan through all simile matches in the text
        // find next match each time until there are no more matches
        while ((m = simileRegex.exec(text)) !== null) {

            tags.push({
                start: m.index,                 // where match begins in text
                end: m.index + m[0].length,     // where match ends, this gives position to rebuild xml with new tags
                type: "simile"                  // tag type
            });
        }

        
        const triggerRegex =
            // "became the painting" object identity connections. trigger makes it so it can be filtered later
            /\b(is|are|was|were|became|becomes)\s+(a|an|the)\s+/gi;

        while ((m = triggerRegex.exec(text)) !== null) {

            // Expand from the  match into a full clause
            const clause = expandClause(text, m.index);
            const clauseText = text.slice(clause.start, clause.end);

            // now filter
            if (isLikelyLiteral(clauseText)) continue;

            // if the full clause is too short, it probably is a literal statement. 
            if (clauseText.split(" ").length < 4) continue;

            tags.push({
                start: clause.start,
                end: clause.end,
                type: "metaphor"
            });
        }

        // makes sure the tags go in the right order to the right metaphors and similes 
        tags.sort((a, b) => a.start - b.start);

 
        // filtered box for things that are to be tagged
        let filtered = [];
        let lastEnd = 0;

        for (let t of tags) {

            // Only accept tags that start after last accepted tag ends so no do overs when we splice the text
            if (t.start >= lastEnd) {
                filtered.push(t);
                lastEnd = t.end;
            }
        }


        let result = "";
        let cursor = 0;

        for (let t of filtered) {

            // Add untagged text before current tag, preserving the format
            result += escapeXML(text.slice(cursor, t.start));

            // Wrap tagged text in XML element:
            result += `<${t.type}>` +
                       escapeXML(text.slice(t.start, t.end)) +
                       `</${t.type}>`;

            cursor = t.end;
        }

        // Add remaining untagged text AFTER last tag
        result += escapeXML(text.slice(cursor));

        // Wrap paragraph in XML with ID
        xml += `<paragraph id="p${pIndex}">${result}</paragraph>`;
    });

    xml += "</book>";
    return xml;

    // grab the full sentence of a metaphor for context
    function expandClause(text, index) {

        const before = text.slice(0, index);
        const after = text.slice(index);

        // Find last sentence boundary before match
        let start = Math.max(
            before.lastIndexOf("."),  // last full stop
            before.lastIndexOf("!"),  // exclamation
            before.lastIndexOf("?")   // question mark
        );

        // If no punctuation found, start at beginning
        start = start === -1 ? 0 : start + 1;

        // Find next sentence boundary AFTER match
        let end = after.search(/[.!?]/);
        // So this finds the next sentence-ending punctuation

        if (end === -1) {
            end = text.length;
        } else {
            end = index + end;
        }

        // determines max metaphor length and stops tagging metaphor at the end of sentences... else everything ends up highlighted.
        //have to do it this way of guessing the legnth else you get tripped up by Mr. and Mrs. 
        const MAX_LENGTH = 120;
        if (end - start > MAX_LENGTH) {
            end = start + MAX_LENGTH;
        }

        return { start, end };
    }

    // FILTERS!!!
    function isLikelyLiteral(clauseText) {

        const lower = clauseText.toLowerCase();

        // blank is a blank... might knock out some metaphors but I haven't found any yet and it lowers false postives significantly. Probably not a problem for Oscar Wilde
    //writing style, which is usually much more flowery when using metaphor or simile
        if (/^[a-z]+\s+(is|was|are|were)\s+(a|an|the)?\s?[a-z]+/.test(lower)) {
            return true;
        }

        // stops statements with adje from being metaphors
        if (/\b(is|was|are|were)\s+\w+$/.test(lower)) {
            return true;
        }

        // People were triggering the metaphor and simile checks a lot because _ is a _ 
        const literalRoles = [
            "man", "woman", "boy", "girl",
            "doctor", "artist", "writer",
            "gentleman", "lady", "friend",
            "student", "teacher"
        ];

        // if it is a literal role = not metaphor. lower is there to standardize it (lowercase)
        for (let role of literalRoles) {
            if (lower.includes(` is a ${role}`) ||
                lower.includes(` was a ${role}`)) {
                return true;
            }
        }

        return false;
    }

    // prevents broken xml 
      function escapeXML(str) {
        return str
            .replace(/&/g, "&amp;")  
            .replace(/</g, "&lt;")  
            .replace(/>/g, "&gt;")   
            .replace(/"/g, "&quot;")  
            .replace(/'/g, "&apos;"); 
    }
}
