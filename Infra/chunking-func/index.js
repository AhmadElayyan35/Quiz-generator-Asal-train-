function extractChunks(text, keyphrases, maxLength = 200) {
    const lines = text.split(/\r?\n/);
    const chunks = {};

    for (let line of lines) {
        const originalLine = line.trim();
        const lowerLine = originalLine.toLowerCase();

        let totalMatches = 0;

        for (const keyphrase of keyphrases) {
            const regex = new RegExp(keyphrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            const matches = lowerLine.match(regex);
            if (matches) {
                totalMatches += matches.length;
            }
        }

        if (totalMatches > 0) {
            const chunk = originalLine.length > maxLength ? originalLine.substring(0, maxLength) : originalLine;
            chunks[chunk] = (chunks[chunk] || 0) + totalMatches;
        }
    }

    return chunks;
}

const httpTrigger = async function (context, req) {
    try {
        const body = req.body;
        const values = body.values || [];
        const results = [];

        for (const record of values) {
            const recordId = record.recordId;
            const data = record.data || {};
            const text = data.content || "";
            const keyphrases = Array.isArray(data.keyphrases) ? data.keyphrases.map(k => k.toLowerCase()) : [];

            if (!text || keyphrases.length === 0) {
                results.push({
                    recordId,
                    errors: [{ message: "Missing content or keyphrases." }]
                });
                continue;
            }

            const chunksMap = extractChunks(text, keyphrases);
            const sortedChunks = Object.entries(chunksMap)
                .sort((a, b) => b[1] - a[1])
                .map(([chunk, occurrences]) => ({ chunk, occurrences }));

            results.push({
                recordId,
                data: {
                    extractedChunks: sortedChunks
                }
            });
        }

        context.res = {
            status: 200,
            body: { values: results },
            headers: { 'Content-Type': 'application/json' }
        };
    } catch (e) {
        context.res = {
            status: 500,
            body: { error: e.message },
            headers: { 'Content-Type': 'application/json' }
        };
    }
};

module.exports = httpTrigger;
