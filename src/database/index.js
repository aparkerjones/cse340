import dotenv from "dotenv";
import pg from "pg";

const { Pool } = pg;

dotenv.config();

// Determine SSL setting from environment
const sslEnabled = process.env.DB_SSL === "true";

// Initialize database connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
});

export const query = async (text, params = []) => {
  return pool.query(text, params);
};

export default pool;