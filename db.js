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

    // A table containing messages between users.
    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
            username  TEXT,
            recipient TEXT,
            message   TEXT,
            timestamp INTEGER,
            FOREIGN KEY(username)  REFERENCES users(username),
            FOREIGN KEY(recipient) REFERENCES users(username),
        )
    `);

    return db;
}
