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
export const getAllProjects = async (limit = 5) => getUpcomingProjects(limit);

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
export const getProjectById = async (projectId) => getProjectDetails(projectId);

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

// Create a new service project
export const createProject = async (
  title,
  description,
  location,
  date,
  organizationId,
) => {
  const sql = `
    INSERT INTO projects (organization_id, title, description, location, project_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;

  const result = await query(sql, [organizationId, title, description, location, date]);
  return result.rows[0]?.project_id ?? null;
};

// Update an existing service project
export const updateProject = async (
  projectId,
  title,
  description,
  location,
  date,
  organizationId,
) => {
  const sql = `
    UPDATE projects
    SET organization_id = $2,
        title = $3,
        description = $4,
        location = $5,
        project_date = $6
    WHERE project_id = $1
    RETURNING project_id;
  `;

  const result = await query(sql, [
    projectId,
    organizationId,
    title,
    description,
    location,
    date,
  ]);

  if (result.rowCount === 0) {
    throw new Error("Unable to update project: project not found.");
  }

  return result.rows[0].project_id;
};
