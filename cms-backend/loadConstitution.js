const mysql = require("mysql2");
const fs = require("fs");
const pdf = require("pdf-parse");

const db = mysql.createConnection({
    host: "localhost",
    user: "coaz",
    password: "Coaz@2025!",
    database: "coaz_website"
});

// Load PDF
async function loadPDF() {
    const path = `${__dirname}/constitution.pdf`;
    if (!fs.existsSync(path)) {
        console.error("❌ constitution.pdf not found in backend folder!");
        process.exit(1);
    }

    const dataBuffer = fs.readFileSync(path);
    const data = await pdf(dataBuffer);

    // Split text into paragraphs (or sections)
    const paragraphs = data.text.split("\n").filter(p => p.trim().length > 20);
    // Create table if missing
    db.query(`
        CREATE TABLE IF NOT EXISTS constitution (
            id INT AUTO_INCREMENT PRIMARY KEY,
            section TEXT
        )
    `, (err) => {
        if (err) throw err;

    paragraphs.forEach(p => {
        db.query("INSERT INTO constitution (section) VALUES (?)", [p], (err) => {
            if (err) console.error(err);
        });
    });

    console.log(`✅ Loaded ${paragraphs.length} sections into MySQL`);
    db.end();
}
    )
}
// Run
loadPDF();


