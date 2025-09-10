const mysql = require("mysql2");
const fs = require("fs");
const pdf = require("pdf-parse");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "coaz_website"
});

// Load PDF
async function loadPDF() {
    const path = "./constitution.pdf";

    if (!fs.existsSync(path)) {
        console.error("❌ constitution.pdf not found in backend folder!");
        process.exit(1);
    }

    const dataBuffer = fs.readFileSync(path);
    const data = await pdf(dataBuffer);

    // Split text into paragraphs (or sections)
    const paragraphs = data.text.split("\n").filter(p => p.trim().length > 20);

    paragraphs.forEach(p => {
        db.query("INSERT INTO constitution (section) VALUES (?)", [p], (err) => {
            if (err) console.error(err);
        });
    });

    console.log(`✅ Loaded ${paragraphs.length} sections into MySQL`);
    db.end();
}

// Run
loadPDF();