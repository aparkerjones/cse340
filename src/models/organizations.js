import { query } from "../database/index.js";

// Retrieve all organizations sorted by name
export const getAllOrganizations = async () => {
  const sql = `
    SELECT organization_id, organization_name, logo_filename, contact_email, description, website_url
    FROM organizations
    ORDER BY organization_name;
  `;

  const result = await query(sql);
  return result.rows;
};