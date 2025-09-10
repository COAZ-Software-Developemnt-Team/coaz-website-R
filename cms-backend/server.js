const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database Configuration
const db = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'coaz_website',
    // waitForConnections: true,
    // connectionLimit: 10

});

// Test database connection
db.getConnection((err, conn) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
    conn.release(); // Release connection back to pool
});

// API Endpoints
// GET all content
// POST: Ask a question about the constitution
app.post('/api/ask', (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "No question provided" });

    db.query(
        "SELECT section FROM constitution WHERE MATCH(section) AGAINST(? IN NATURAL LANGUAGE MODE) LIMIT 3",
        [question],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length === 0) {
                return res.json({
                    answer: "Sorry, I couldn’t find anything in the constitution about that."
                });
            }

            // Merge top results
            const answer = results.map(r => r.section).join("\n\n");
            res.json({ answer });
        }
    );
});

app.get('/api/content', (req, res) => {
    db.query('SELECT * FROM content', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST new content
app.post('/api/content', (req, res) => {
    const { title, body } = req.body;
    db.query(
        'INSERT INTO content (title, body) VALUES (?, ?)',
        [title, body],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, title, body });
        }
    );
});

// PUT update content
app.put('/api/content/:id', (req, res) => {
    const { id } = req.params;
    const { title, body } = req.body;
    db.query(
        'UPDATE content SET title = ?, body = ? WHERE id = ?',
        [title, body, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.sendStatus(200);
        }
    );
});

// DELETE content
app.delete('/api/content/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM content WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.sendStatus(204);
    });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});