const express = require("express");
const cors = require("cors");
const fs = require("fs");
const pdf = require("pdf-parse");

const app = express();
app.use(cors());
app.use(express.json());

let constitution = [];

// Load and parse the constitution PDF
async function loadConstitution() {
    const path = `${__dirname}/constitution.pdf`;

    if (!fs.existsSync(path)) {
        console.error("❌ constitution.pdf not found!");
        return;
    }

    const dataBuffer = fs.readFileSync(path);
    const data = await pdf(dataBuffer);

    // Split into paragraphs
    constitution = data.text
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p.length > 20);

    console.log(`✅ Loaded ${constitution.length} sections from constitution`);
}

app.post("/api/ask", (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "No question provided" });

    // Simple keyword search
    const results = constitution.filter((p) =>
        p.toLowerCase().includes(question.toLowerCase())
    );

    if (results.length === 0) {
        return res.json({
            answer: "Sorry, I couldn’t find anything in the constitution about that.",
        });
    }

    // Return top 3 matches
    const answer = results.slice(0, 3).join("\n\n");
    res.json({ answer });
});

// Start server after loading constitution
loadConstitution().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

});
