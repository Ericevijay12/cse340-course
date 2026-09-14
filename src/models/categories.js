import pool from './db.js';

export async function getAllCategories() {
  const query = `
    SELECT 
      category_id, 
      name 
    FROM categories 
    ORDER BY name ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function getCategoryById(categoryId) {
  const query = `
    SELECT 
      category_id, 
      name 
    FROM categories 
    WHERE category_id = $1;
  `;
  const result = await pool.query(query, [categoryId]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getCategoriesByProjectId(projectId) {
  const query = `
    SELECT 
      c.category_id, 
      c.name 
    FROM categories c
    JOIN project_categories pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.name ASC;
  `;
  const result = await pool.query(query, [projectId]);
  return result.rows;
}
