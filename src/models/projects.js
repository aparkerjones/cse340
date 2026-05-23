import { query } from "../database/index.js";

// Retrieve all projects with their sponsoring organization
export const getUpcomingProjects = async (limit = 5) => {
  const sql = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      p.project_date AS date,
      o.organization_id,
      o.organization_name
    FROM projects p
    JOIN organizations o
      ON p.organization_id = o.organization_id
    WHERE p.project_date >= CURRENT_DATE
    ORDER BY p.project_date, p.title
    LIMIT $1;
  `;

  const result = await query(sql, [limit]);
  return result.rows;
};

// Backward-compatible alias for earlier naming
export const getAllProjects = getUpcomingProjects;

// Retrieve one project and its sponsoring organization
export const getProjectDetails = async (projectId) => {
  const sql = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      p.project_date AS date,
      o.organization_id,
      o.organization_name
    FROM projects p
    JOIN organizations o
      ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;
  `;

  const result = await query(sql, [projectId]);
  return result.rows[0] ?? null;
};

// Backward-compatible alias for earlier naming
export const getProjectById = getProjectDetails;

// Retrieve all categories assigned to one project
export const getCategoriesByProjectId = async (projectId) => {
  const sql = `
    SELECT c.category_id, c.category_name
    FROM categories c
    JOIN project_categories pc
      ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.category_name;
  `;

  const result = await query(sql, [projectId]);
  return result.rows;
};