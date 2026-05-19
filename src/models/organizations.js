import { query } from "../database/index.js";

// Retrieve all organizations sorted by name
export async function getAllOrganizations() {
  const sql = `
    SELECT organization_id, organization_name
    FROM organizations
    ORDER BY organization_name;
  `;

  const result = await query(sql);
  return result.rows;
}