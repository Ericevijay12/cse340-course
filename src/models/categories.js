import pool from './db.js';

export async function getAllCategories() {
  const query = `
    SELECT category_id, name 
    FROM categories 
    ORDER BY name ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function getCategoryById(categoryId) {
  const query = `
    SELECT category_id, name 
    FROM categories 
    WHERE category_id = $1;
  `;
  const result = await pool.query(query, [categoryId]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getCategoriesByProjectId(projectId) {
  const query = `
    SELECT c.category_id, c.name 
    FROM categories c
    JOIN project_categories pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.name ASC;
  `;
  const result = await pool.query(query, [projectId]);
  return result.rows;
}

export async function createCategory(name) {
  const query = `
    INSERT INTO categories (name)
    VALUES ($1)
    RETURNING category_id;
  `;
  const result = await pool.query(query, [name]);
  if (result.rows.length === 0) {
    throw new Error('Failed to create category');
  }
  return result.rows[0].category_id;
}

export async function updateCategory(categoryId, name) {
  const query = `
    UPDATE categories
    SET name = $1
    WHERE category_id = $2
    RETURNING category_id;
  `;
  const result = await pool.query(query, [name, categoryId]);
  if (result.rows.length === 0) {
    throw new Error('Category not found');
  }
  return result.rows[0].category_id;
}

export async function assignCategoryToProject(categoryId, projectId) {
  const query = `
    INSERT INTO project_categories (category_id, project_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
  `;
  await pool.query(query, [categoryId, projectId]);
}

export async function updateCategoryAssignments(projectId, categoryIds) {
  const deleteQuery = `
    DELETE FROM project_categories
    WHERE project_id = $1;
  `;
  await pool.query(deleteQuery, [projectId]);

  for (const catId of categoryIds) {
    if (catId) {
      await assignCategoryToProject(catId, projectId);
    }
  }
}
