import { createClient } from "@libsql/client";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// Carica le variabili (necessario qui per ESM import hoisting)
dotenv.config({ path: ".env.local" });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carica l'URL dal .env o usa il file locale come fallback
const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables. Please check your .env files.");
}

const DB_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;

// Crea il client LibSQL (Turso)
const db = createClient({
  url: DB_URL,
  ...(DB_AUTH_TOKEN ? { authToken: DB_AUTH_TOKEN } : {}),
});

// --- SCHEMA ---
// Nota: db.execute è asincrono. L'inizializzazione dello schema 
// dovrebbe idealmente essere fatta in una funzione di setup.

export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contacts (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT    NOT NULL,
      email     TEXT    NOT NULL UNIQUE,
      phone     TEXT,
      notes     TEXT,
      created_at TEXT   NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

// Eseguiamo l'init (top-level await supportato in ES modules)
await initDb();

// --- TIPI ---

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  created_at: string;
}

// --- QUERY HELPERS ---

export const contactsDb = {
  /** Aggiunge un nuovo contatto, ritorna il contatto creato */
  async add(contact: { name: string; email: string; phone?: string | null; notes?: string | null }): Promise<Contact> {
    const res = await db.execute({
      sql: `INSERT INTO contacts (name, email, phone, notes)
            VALUES (?, ?, ?, ?)`,
      args: [
        contact.name,
        contact.email,
        contact.phone ?? null,
        contact.notes ?? null
      ],
    });
    return (await contactsDb.getById(Number(res.lastInsertRowid)))!;
  },

  /** Ritorna tutti i contatti */
  async list(): Promise<Contact[]> {
    const rs = await db.execute("SELECT * FROM contacts ORDER BY name ASC");
    return rs.rows as unknown as Contact[];
  },

  /** Cerca un contatto per nome (case-insensitive, match parziale) */
  async findByName(name: string): Promise<Contact[]> {
    const rs = await db.execute({
      sql: "SELECT * FROM contacts WHERE LOWER(name) LIKE LOWER(?) ORDER BY name ASC",
      args: [`%${name}%`],
    });
    return rs.rows as unknown as Contact[];
  },

  /** Ritorna un contatto per ID */
  async getById(id: number): Promise<Contact | undefined> {
    const rs = await db.execute({
      sql: "SELECT * FROM contacts WHERE id = ?",
      args: [id],
    });
    return rs.rows[0] as unknown as Contact | undefined;
  },

  /** Ritorna un contatto per email */
  async getByEmail(email: string): Promise<Contact | undefined> {
    const rs = await db.execute({
      sql: "SELECT * FROM contacts WHERE LOWER(email) = LOWER(?)",
      args: [email],
    });
    return rs.rows[0] as unknown as Contact | undefined;
  },

  /** Elimina un contatto per ID */
  async delete(id: number): Promise<boolean> {
    const res = await db.execute({
      sql: "DELETE FROM contacts WHERE id = ?",
      args: [id],
    });
    return res.rowsAffected > 0;
  },

  /** Aggiorna un contatto esistente */
  async update(id: number, updates: { name?: string; email?: string; phone?: string | null; notes?: string | null }): Promise<Contact | undefined> {
    const current = await contactsDb.getById(id);
    if (!current) return undefined;

    const name = updates.name ?? current.name;
    const email = updates.email ?? current.email;
    const phone = updates.hasOwnProperty('phone') ? updates.phone : current.phone;
    const notes = updates.hasOwnProperty('notes') ? updates.notes : current.notes;

    await db.execute({
      sql: `UPDATE contacts SET name = ?, email = ?, phone = ?, notes = ? WHERE id = ?`,
      args: [name, email, phone, notes, id],
    });

    return await contactsDb.getById(id);
  },
};

export default db;
