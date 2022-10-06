// SQLite3 Database Definitions.

// Initialize the database, create tables if they don't exist.
export function get() {
    const db = new sqlite3.Database('app.db');

    // A table containing user and login information.
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            username TEXT,
            password TEXT,
            email    TEXT,
            name     TEXT,
            photo    TEXT,
            bio      TEXT
        )
    `);

    return db;
}
