import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "database.db");

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeSchema(db);
  }
  return db;
}

function initializeSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS sliders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      button_text TEXT,
      button_link TEXT,
      desktop_image TEXT,
      mobile_image TEXT,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT,
      banner_image TEXT,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      short_description TEXT,
      description TEXT,
      category_id INTEGER,
      main_image TEXT,
      is_featured INTEGER DEFAULT 0,
      is_new INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      image TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS concepts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      cover_image TEXT,
      category_id INTEGER,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS concept_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      concept_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (concept_id) REFERENCES concepts(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      image TEXT NOT NULL,
      category TEXT DEFAULT 'Genel',
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS instagram_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image TEXT NOT NULL,
      caption TEXT,
      link TEXT,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Default settings
  const insertSetting = db.prepare(
    "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)"
  );
  const defaults: [string, string][] = [
    ["store_name", "Gözde Çeyiz Aksesuar ve Kına Evi"],
    ["phone", "+90 531 790 65 63"],
    ["whatsapp", "+905317906563"],
    ["address", "İstanbul, Türkiye"],
    ["google_maps", ""],
    ["instagram", "https://www.instagram.com/gozdeceyiz"],
    ["facebook", ""],
    ["working_hours", "Pazartesi - Cumartesi: 09:00 - 20:00\nPazar: 10:00 - 18:00"],
    ["about_text", "Özel günlerinize zarafet ve şıklık katıyoruz. Düğün, kına, nişan, söz ve sünnet organizasyonlarınız için en güzel aksesuarları sunuyoruz."],
    ["logo", ""],
    ["favicon", ""],
  ];
  for (const [key, value] of defaults) {
    insertSetting.run(key, value);
  }

  // Default admin user (password: admin123)
  const bcrypt = require("bcryptjs");
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare(
    "INSERT OR IGNORE INTO admin_users (username, password) VALUES (?, ?)"
  ).run("admin", hashedPassword);
}

export default getDb;
