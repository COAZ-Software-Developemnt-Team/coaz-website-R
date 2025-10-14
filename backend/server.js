const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('pdf-parse');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'https://coaz.org'],
    methods: ['GET', 'POST'],
};
app.use(cors(corsOptions));

// Preload PDF before starting server
let constitutionText = '';

const { exec } = require('child_process');

async function loadConstitution() {
    try {
        // Use pdftotext to extract text (proven to work)
        const text = await new Promise((resolve, reject) => {
            exec(
                `pdftotext /var/www/vhosts/coaz.org/httpdocs/backend/constitution.pdf -`, // "-" outputs to stdout
                (error, stdout, stderr) => {
                    if (error) reject(error);
                    else resolve(stdout);
                }
            );
        });
        constitutionText = text;
        console.log('PDF loaded! Text length:', text.length);
    } catch (error) {
        console.error('PDF extraction failed:', error.message);
        process.exit(1);
    }
}

// Start server only AFTER PDF is loaded
(async () => {
    await loadConstitution();

    app.post('/api/chat', (req, res) => {
        const query = req.body.query?.toLowerCase();

        if (!constitutionText) {
            return res.status(503).json({
                error: "Server still loading... Please try again in a moment."
            });
        }

        if (!query) {
            return res.status(400).json({ error: "Query is required." });
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

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();