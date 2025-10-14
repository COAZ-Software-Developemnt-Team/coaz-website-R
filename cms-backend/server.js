const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('pdf-parse');
const fs = require('fs');
const cors = require('cors');
const Fuse = require("fuse.js");
const app = express();

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'https://coaz.org'],
    methods: ['GET', 'POST'],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

let fuse;
let constitutionSections = [];
let constitutionFullText = '';

// Load and parse constitution PDF
async function loadConstitution() {
    try {
        const dataBuffer = fs.readFileSync(`${__dirname}/constitution.pdf`);
        const data = await pdf(dataBuffer);
        console.log('PDF loaded successfully!');

        constitutionFullText = data.text;

        // Create sections by splitting on major headings
        constitutionSections = data.text
            .split(/(?=\b[A-Z][A-Za-z ]+\b)/g)
            .map(section => section.trim())
            .filter(section => section.length > 20);

        console.log(`Loaded ${constitutionSections.length} sections from the constitution.`);
    } catch (error) {
        console.error('Failed to load PDF:', error.message);
        process.exit(1);
    }
}

function initFuse() {
    if (constitutionSections.length === 0) {
        console.error('No constitution sections loaded');
        return;
    }

    fuse = new Fuse(constitutionSections, {
        includeScore: true,
        threshold: 0.3,
        ignoreLocation: true,
        minMatchCharLength: 3,
        keys: [
            { name: "text", weight: 1 },
            { name: "section", weight: 0.7 }
        ]
    });
    console.log("✅ Constitution loaded and searchable");
}

function searchConstitution(query, limit = 3) {
    if (!fuse) {
        console.error('Fuse not initialized');
        return ["⚠️ Search not ready"];
    }

    const results = fuse.search(query, { limit });

    if (results.length === 0) {
        const broadResults = fuse.search(query.split(/\s+/)[0], { limit });
        if (broadResults.length > 0) {
            return broadResults.map(r => r.item);
        }

        const searchTerm = query.toLowerCase();
        const index = constitutionFullText.toLowerCase().indexOf(searchTerm);
        if (index !== -1) {
            const context = constitutionFullText.substring(Math.max(0, index - 100), index + searchTerm.length + 100);
            return [`Found in document: "${context}"`];
        }
    }

    return results.length > 0 ? results.map(r => r.item) : ["❌ Sorry, I couldn’t find anything in the constitution about that."];
}

function highlightKeywords(text, query) {
    const keywords = query.split(/\s+/).filter(word => word.length > 2); // skip very short words
    let result = text;
    for (const word of keywords) {
        const regex = new RegExp(`(${word})`, "gi");
        result = result.replace(regex, "<mark>$1</mark>");
    }
    return result;
}

function formatAnswer(query, answers) {
    if (answers.length === 1 && answers[0].startsWith("❌")) {
        return answers[0];
    }

    const processedAnswers = answers.map(answer =>
        highlightKeywords(answer, query)
    );

    return `📖 Based on the constitution, here’s what I found for your question (“${query}”):\n\n${processedAnswers.join("\n\n---\n\n")}`;
}

// Chat endpoint
app.post("/api/chat", async (req, res) => {
    // const { message } = req.body;
    // console.log("💬 User asked:", message);
    //
    // if (!message || message.trim() === "") {
    //     return res.status(400).json({ error: "Message cannot be empty." });
    // }
    //
    // const answers = searchConstitution(message);
    // const formattedAnswer = formatAnswer(message, answers);

    const { query } = req.body;
    console.log("💬 User asked:", query);

    if (!query || query.trim() === "") {
        return res.status(400).json({ error: "Query cannot be empty." });
    }

    const answers = searchConstitution(query);
    const formattedAnswer = formatAnswer(query, answers);

    res.json({
        sender: "bot",
        text: formattedAnswer
    });
});

(async () => {
    await loadConstitution();
    initFuse();

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();