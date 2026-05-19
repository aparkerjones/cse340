import { query } from "../database/index.js";

// Retrieve all projects with their sponsoring organization
export async function getAllProjects() {
  const sql = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      o.organization_name
    FROM projects p
    JOIN organizations o
      ON p.organization_id = o.organization_id
    ORDER BY p.project_date, p.title;
  `;

  const result = await query(sql);
  return result.rows;
}