import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';


dotenv.config();

const app = express();
const db = new sqlite3.Database(':memory:');

app.use(cors());
app.use(express.json());

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      twoFactorSecret TEXT,
      twoFactorEnabled INTEGER DEFAULT 0
    )
  `);
});

app.use('/api',authRoutes)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


export default db;