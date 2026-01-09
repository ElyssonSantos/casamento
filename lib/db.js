
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'wedding.db');
const db = new Database(dbPath);

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS guests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      cpf TEXT UNIQUE NOT NULL,
      phone TEXT,
      confirmed INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Ensure DB is initialized
try {
    initDB();
} catch (e) {
    console.error("DB Init Error:", e);
}

export default db;
