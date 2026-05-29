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

// Create a new category
export const createCategory = async (categoryName) => {
  const sql = `
    INSERT INTO categories (category_name)
    VALUES ($1)
    RETURNING category_id;
  `;

  const result = await query(sql, [categoryName]);
  return result.rows[0]?.category_id ?? null;
};

// Update an existing category
export const updateCategory = async (categoryId, categoryName) => {
  const sql = `
    UPDATE categories
    SET category_name = $2
    WHERE category_id = $1
    RETURNING category_id;
  `;

  const result = await query(sql, [categoryId, categoryName]);

  if (result.rowCount === 0) {
    throw new Error("Unable to update category: category not found.");
  }

  return result.rows[0].category_id;
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

const assignCategoryToProject = async (projectId, categoryId) => {
  const sql = `
    INSERT INTO project_categories (project_id, category_id)
    VALUES ($1, $2);
  `;

  await query(sql, [projectId, categoryId]);
};

export const updateCategoryAssignments = async (projectId, categoryIds) => {
  const deleteSql = `
    DELETE FROM project_categories
    WHERE project_id = $1;
  `;

  await query(deleteSql, [projectId]);

  for (const categoryId of categoryIds) {
    await assignCategoryToProject(projectId, Number(categoryId));
  }
};
