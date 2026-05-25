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

// Create a new organization
export async function createOrganization(name, description, websiteUrl) {
  const sql = `
    INSERT INTO organizations (organization_name, description, website_url)
    VALUES ($1, $2, $3)
    RETURNING organization_id;
  `;

  const result = await query(sql, [name, description, websiteUrl]);
  return result.rows[0]?.organization_id ?? null;
}

// Update an existing organization
export async function updateOrganization(id, name, description, websiteUrl) {
  const sql = `
    UPDATE organizations
    SET organization_name = $2,
        description = $3,
        website_url = $4
    WHERE organization_id = $1;
  `;

  await query(sql, [id, name, description, websiteUrl]);
}