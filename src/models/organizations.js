import { query } from "../database/index.js";

// Retrieve all organizations sorted by name
export async function getAllOrganizations() {
  const sql = `
    SELECT organization_id, organization_name, description, website_url
    FROM organizations
    ORDER BY organization_name;
  `;

  const result = await query(sql);
  return result.rows;
}

// Retrieve one organization by ID
export async function getOrganizationById(organizationId) {
  const sql = `
    SELECT organization_id, organization_name, description, website_url
    FROM organizations
    WHERE organization_id = $1;
  `;

  const result = await query(sql, [organizationId]);
  return result.rows[0] ?? null;
}

// Retrieve all projects for one organization
export async function getProjectsByOrganizationId(organizationId) {
  const sql = `
    SELECT
      project_id,
      title,
      location,
      project_date
    FROM projects
    WHERE organization_id = $1
    ORDER BY project_date, title;
  `;

  const result = await query(sql, [organizationId]);
  return result.rows;
}