const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('pdf-parse');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Load PDF content
let constitutionText = '';
fs.readFile('./constitution.pdf', (err, data) => {
    if (err) {
        console.error('Failed to load PDF:', err);
        process.exit(1);
    }
    pdf(data).then(parsed => {
        constitutionText = parsed.text;
        console.log('PDF loaded successfully!');
    });
});

// Chat endpoint
app.post('/chat', (req, res) => {
    const query = req.body.query.toLowerCase();

    if (!constitutionText) {
        return res.status(503).json({
            error: "Server still loading... Please try again in a moment."
        });
    }

    const index = constitutionText.toLowerCase().indexOf(query);

    if (index !== -1) {
        const start = Math.max(0, index - 50);
        const end = Math.min(constitutionText.length, index + query.length + 150);
        const answer = constitutionText.substring(start, end);

        res.json({ answer });
    } else {
        res.json({ answer: "No relevant information found in the constitution." });
    }
});

app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});