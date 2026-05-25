import { query } from "../database/index.js";

// Retrieve all service project categories
export const getAllCategories = async () => {
  const sql = `
    SELECT category_id, category_name
    FROM categories
    ORDER BY category_name;
  `;

  const result = await query(sql);
  return result.rows;
};

// Retrieve one category by ID
export const getCategoryById = async (categoryId) => {
  const sql = `
    SELECT category_id, category_name
    FROM categories
    WHERE category_id = $1;
  `;

  const result = await query(sql, [categoryId]);
  return result.rows[0] ?? null;
};

// Retrieve all projects associated with one category
export const getProjectsByCategoryId = async (categoryId) => {
  const sql = `
    SELECT
      p.project_id,
      p.title,
      p.project_date,
      p.location
    FROM projects p
    JOIN project_categories pc
      ON p.project_id = pc.project_id
    WHERE pc.category_id = $1
    ORDER BY p.project_date, p.title;
  `;

  const result = await query(sql, [categoryId]);
  return result.rows;
};

async function assignCategoryToProject(projectId, categoryId) {
  const sql = `
    INSERT INTO project_categories (project_id, category_id)
    VALUES ($1, $2);
  `;

  await query(sql, [projectId, categoryId]);
}

export async function updateCategoryAssignments(projectId, categoryIds) {
  const deleteSql = `
    DELETE FROM project_categories
    WHERE project_id = $1;
  `;

  await query(deleteSql, [projectId]);

  for (const categoryId of categoryIds) {
    await assignCategoryToProject(projectId, Number(categoryId));
  }
}
