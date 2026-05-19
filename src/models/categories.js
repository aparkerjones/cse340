import { query } from "../database/index.js";

// Retrieve all service project categories
export async function getAllCategories() {
  const sql = `
    SELECT category_id, category_name
    FROM categories
    ORDER BY category_name;
  `;

  const result = await query(sql);
  return result.rows;
}